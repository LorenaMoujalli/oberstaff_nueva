import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('c:/Users/EQUIPO/Desktop/oberstaff_nueva/oberstaff', 'leads.db');
const db = new Database(dbPath);

const emailLower = 'test@gmail.com';

try {
    const stmt1 = db.prepare(`
        SELECT 1 FROM leads, json_each(leads.data)
        WHERE (LOWER(json_each.key) LIKE '%email%' OR LOWER(json_each.key) LIKE '%correo%')
          AND LOWER(json_each.value) = ?
        LIMIT 1
    `);
    const result1 = stmt1.get(emailLower);
    console.log('QUERY 1 (from server.js):', result1);
} catch (err) {
    console.error('QUERY 1 ERROR:', err.message);
}

const stmt2 = db.prepare(`
    SELECT id FROM leads 
    WHERE EXISTS (
      SELECT 1 FROM json_each(leads.data) 
      WHERE (LOWER(json_each.key) LIKE '%email%' OR LOWER(json_each.key) LIKE '%correo%')
      AND LOWER(CAST(json_each.value AS TEXT)) = ?
    )
`);
const result2 = stmt2.get(emailLower);
console.log('QUERY 2 (with CAST AS TEXT):', result2);
