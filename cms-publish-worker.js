/**
 * Goosebumps CMS Publish Worker
 * Deploy this to Cloudflare Workers.
 *
 * Required environment secrets (set in Cloudflare dashboard → Workers → your worker → Settings → Variables):
 *   GH_TOKEN  — GitHub Personal Access Token with Contents:Write on DSMeridian/goosebumpsevents.eu
 *   CMS_KEY   — Any secret string you choose (e.g. same as CMS password). Must match WORKER_KEY in index.html.
 */

const GH_OWNER  = 'DSMeridian';
const GH_REPO   = 'goosebumpsevents.eu';
const GH_BRANCH = 'main';
const GH_FILE   = 'index.html';

const ALLOWED_ORIGINS = [
  'https://goosebumpsevents.eu',
  'http://localhost:3099',
];

function corsHeaders(origin) {
  const o = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try { body = await request.json(); } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
    }

    if (!body.key || body.key !== env.CMS_KEY) {
      return jsonResponse({ error: 'Unauthorized' }, 401, origin);
    }

    const htmlB64 = body.htmlB64;
    if (!htmlB64 || htmlB64.length < 1000) {
      return jsonResponse({ error: 'Missing content' }, 400, origin);
    }

    try {
      await pushToGitHub(htmlB64, env.GH_TOKEN);
      return jsonResponse({ success: true }, 200, origin);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500, origin);
    }
  },
};

async function pushToGitHub(htmlB64, token) {
  const h = {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GoosebumpsCMS/1.0',
  };
  const base = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}`;

  const refR = await fetch(`${base}/git/refs/heads/${GH_BRANCH}`, { headers: h });
  if (!refR.ok) throw new Error((await refR.json()).message);
  const { object: { sha: commitSha } } = await refR.json();

  const comR = await fetch(`${base}/git/commits/${commitSha}`, { headers: h });
  const { tree: { sha: treeSha } } = await comR.json();

  const blobR = await fetch(`${base}/git/blobs`, {
    method: 'POST', headers: h,
    body: JSON.stringify({ content: htmlB64, encoding: 'base64' }),
  });
  if (!blobR.ok) throw new Error('Blob: ' + (await blobR.json()).message);
  const { sha: blobSha } = await blobR.json();

  const treeR = await fetch(`${base}/git/trees`, {
    method: 'POST', headers: h,
    body: JSON.stringify({ base_tree: treeSha, tree: [{ path: GH_FILE, mode: '100644', type: 'blob', sha: blobSha }] }),
  });
  if (!treeR.ok) throw new Error('Tree: ' + (await treeR.json()).message);
  const { sha: newTreeSha } = await treeR.json();

  const newComR = await fetch(`${base}/git/commits`, {
    method: 'POST', headers: h,
    body: JSON.stringify({ message: 'Update content via CMS', tree: newTreeSha, parents: [commitSha] }),
  });
  if (!newComR.ok) throw new Error('Commit: ' + (await newComR.json()).message);
  const { sha: newComSha } = await newComR.json();

  const updR = await fetch(`${base}/git/refs/heads/${GH_BRANCH}`, {
    method: 'PATCH', headers: h,
    body: JSON.stringify({ sha: newComSha }),
  });
  if (!updR.ok) throw new Error('Ref: ' + (await updR.json()).message);
}
