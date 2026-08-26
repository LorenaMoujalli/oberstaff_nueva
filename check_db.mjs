import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('c:/Users/EQUIPO/Desktop/oberstaff_nueva/oberstaff', 'leads.db');
const db = new Database(dbPath);

const rows = db.prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 5').all();
console.log("LAST 5 ROWS IN DB:");
console.log(JSON.stringify(rows, null, 2));

// Test the exact query
const emailLower = 'test@gmail.com';
const duplicate = db.prepare(`
    SELECT id FROM leads 
    WHERE EXISTS (
      SELECT 1 FROM json_each(leads.data) 
      WHERE (LOWER(json_each.key) LIKE '%email%' OR LOWER(json_each.key) LIKE '%correo%')
      AND LOWER(CAST(json_each.value AS TEXT)) = ?
    )
`).get(emailLower);

console.log('DUPLICATE CHECK FOR test@gmail.com:');
console.log(duplicate);
