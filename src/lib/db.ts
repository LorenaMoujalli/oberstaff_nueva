import Database from 'better-sqlite3';
import path from 'path';

// Define DB path at the root of the project
const dbPath = path.resolve(process.cwd(), 'leads.db');

const db = new Database(dbPath);

// Initialize table with current schema
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT (datetime('now', 'localtime')),
    form_name TEXT,
    pais TEXT,
    data TEXT
  )
`);

// Migration: add new columns to existing DBs silently
try { db.exec(`ALTER TABLE leads ADD COLUMN form_name TEXT`); } catch (_) {}
try { db.exec(`ALTER TABLE leads ADD COLUMN pais TEXT`); } catch (_) {}

export interface Lead {
  id?: number;
  timestamp?: string;
  form_name?: string;
  pais?: string;
  data: Record<string, any>;
}

export function saveLead(lead: Lead) {
  const stmt = db.prepare(`
    INSERT INTO leads (form_name, pais, data)
    VALUES (?, ?, ?)
  `);
  return stmt.run(
    lead.form_name ?? null,
    lead.pais ?? null,
    JSON.stringify(lead.data)
  );
}

export function getAllLeads(): Lead[] {
  const stmt = db.prepare('SELECT * FROM leads ORDER BY id DESC');
  const rows = stmt.all();
  return rows.map((row: any) => ({
    ...row,
    data: JSON.parse(row.data),
  }));
}

export default db;
