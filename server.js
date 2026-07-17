import http from 'http';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// ──────────────────────────────────────────────
// Database setup — esquema limpio sin webhook_url
// Columnas: id, timestamp, form_name, pais, data
// ──────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'leads.db');
const db = new Database(dbPath);

// Forzar UTF-8 para soporte completo de ñ y caracteres especiales
db.pragma('encoding = "UTF-8"');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT    DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
    form_name TEXT,
    pais      TEXT,
    data      TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT UNIQUE,
    password  TEXT
  );
`);

// Asegurar usuario administrador con la nueva contraseña requerida
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminUser) {
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', 'adminOberstaff8*');
} else {
  db.prepare('UPDATE users SET password = ? WHERE username = ?').run('adminOberstaff8*', 'admin');
}

// ──────────────────────────────────────────────
// HTTP Server (API only — statics served by nginx)
// ──────────────────────────────────────────────
const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // ── POST /api/guardar-lead ──────────────────
  if (req.method === 'POST' && req.url === '/api/guardar-lead') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString('utf8'); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const formName = payload.formName ?? null;
        const pais     = payload.pais     ?? null;
        const data     = payload.data     ?? {};

        db.prepare(`
          INSERT INTO leads (form_name, pais, data)
          VALUES (?, ?, ?)
        `).run(formName, pais, JSON.stringify(data));

        res.writeHead(200, CORS_HEADERS);
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('[guardar-lead] Error:', err.message);
        res.writeHead(500, CORS_HEADERS);
        res.end(JSON.stringify({ error: 'Error interno' }));
      }
    });
    return;
  }

  // ── POST /api/eliminar-lead ──────────────────
  if (req.method === 'POST' && req.url === '/api/eliminar-lead') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString('utf8'); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const id = payload.id;
        if (!id) {
          res.writeHead(400, CORS_HEADERS);
          res.end(JSON.stringify({ error: 'ID requerido' }));
          return;
        }

        db.prepare('DELETE FROM leads WHERE id = ?').run(id);

        res.writeHead(200, CORS_HEADERS);
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('[eliminar-lead] Error:', err.message);
        res.writeHead(500, CORS_HEADERS);
        res.end(JSON.stringify({ error: 'Error interno' }));
      }
    });
    return;
  }

  // ── POST /api/login ──────────────────
  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString('utf8'); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const username = payload.username;
        const password = payload.password;

        if (!username || !password) {
          res.writeHead(400, CORS_HEADERS);
          res.end(JSON.stringify({ error: 'Credenciales incompletas' }));
          return;
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
        if (user) {
          res.writeHead(200, CORS_HEADERS);
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(401, CORS_HEADERS);
          res.end(JSON.stringify({ error: 'Usuario o contraseña incorrectos' }));
        }
      } catch (err) {
        console.error('[login] Error:', err.message);
        res.writeHead(500, CORS_HEADERS);
        res.end(JSON.stringify({ error: 'Error interno' }));
      }
    });
    return;
  }

  // ── GET /api/leads (listado para debug) ────
  if (req.method === 'GET' && req.url === '/api/leads') {
    try {
      const rows = db.prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 50').all();
      res.writeHead(200, CORS_HEADERS);
      res.end(JSON.stringify(rows));
    } catch (err) {
      console.error('[leads] Error:', err.message);
      res.writeHead(500, CORS_HEADERS);
      res.end(JSON.stringify({ error: 'Error interno' }));
    }
    return;
  }

  // ── GET /api/leads-dashboard (todos los leads para el dashboard) ────
  if (req.method === 'GET' && req.url === '/api/leads-dashboard') {
    try {
      const rows = db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
      res.writeHead(200, CORS_HEADERS);
      res.end(JSON.stringify(rows));
    } catch (err) {
      console.error('[leads-dashboard] Error:', err.message);
      res.writeHead(500, CORS_HEADERS);
      res.end(JSON.stringify({ error: 'Error interno' }));
    }
    return;
  }

  res.writeHead(404, CORS_HEADERS);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = process.env.API_PORT || 3001;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[API Server] Escuchando en http://127.0.0.1:${PORT}`);
  console.log(`[API Server] DB: ${dbPath}`);
});
