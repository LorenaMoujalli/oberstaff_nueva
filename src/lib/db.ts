import Database from 'better-sqlite3';
import path from 'path';

// Define DB path at the root of the project
const dbPath = path.resolve(process.cwd(), 'leads.db');

const db = new Database(dbPath);

// Initialize table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT (datetime('now', 'localtime')),
    webhook_url TEXT,
    data TEXT
  ) 
`);

export interface Lead {
  id?: number;
  timestamp?: string;
  webhook_url: string;
  data: Record<string, any>;
}

export function saveLead(lead: Lead) {
  const stmt = db.prepare(`
    INSERT INTO leads (webhook_url, data)
    VALUES (?, ?)
  `);
  return stmt.run(lead.webhook_url, JSON.stringify(lead.data));
}

export function getAllLeads() {
  const stmt = db.prepare('SELECT * FROM leads ORDER BY id DESC');
  const rows = stmt.all();
  return rows.map((row: any) => ({
    ...row,
    data: JSON.parse(row.data)
  }));
}

export default db;
