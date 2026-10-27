import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('./', import.meta.url));
const root = join(projectRoot, 'public');
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  const requestPath = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  const projectDocument = requestPath === '/SPEC.md' ? normalize(join(projectRoot, 'SPEC.md')) : null;
  const candidate = projectDocument || normalize(join(root, requestPath === '/' ? 'index.html' : requestPath));
  const safeRoot = root.endsWith(sep) ? root : `${root}${sep}`;

  try {
    if (!projectDocument && !candidate.startsWith(safeRoot)) throw new Error('Invalid path');
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error('Not a file');
    const contentType = projectDocument ? 'text/markdown; charset=utf-8' : (mime[extname(candidate)] || 'application/octet-stream');
    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
    res.end(await readFile(candidate));
  } catch {
    if (!extname(requestPath)) {
      res.writeHead(200, { 'Content-Type': mime['.html'], 'Cache-Control': 'no-cache' });
      res.end(await readFile(join(root, 'index.html')));
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`MediaVault listening on http://0.0.0.0:${port}`);
});
