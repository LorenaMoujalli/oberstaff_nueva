const http = require('http');
const Database = require('better-sqlite3');
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(process.cwd(), 'leads.db');
const db = new Database(dbPath);

// Initialize DB table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT (datetime('now', 'localtime')),
    webhook_url TEXT,
    data TEXT
  )
`);

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST' && req.url === '/api/guardar-lead') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const { webhookUrl, data, formName, pais } = parsed;

        if (!webhookUrl) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Falta la URL del webhook' }));
          return;
        }

        // Add formName and pais to data if present so it stores inside the JSON data field in DB
        const finalData = { ...data };
        if (formName) {
          finalData['Origen Formulario'] = formName;
        }
        if (pais) {
          finalData['Pais'] = pais;
        }

        const stmt = db.prepare(`
          INSERT INTO leads (webhook_url, data)
          VALUES (?, ?)
        `);
        stmt.run(webhookUrl, JSON.stringify(finalData));

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, sqlite: true }));
      } catch (err) {
        console.error('Error procesando lead en el backend:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Error interno de base de datos' }));
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = 3000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[Backend Daemon] Escuchando en http://127.0.0.1:${PORT}`);
});
