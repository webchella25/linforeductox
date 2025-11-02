import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export async function initDatabase() {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    const schemaPath = path.join(process.cwd(), 'lib/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Ejecutar el schema
    await sql.query(schema);
    
    console.log('✅ Base de datos inicializada correctamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}