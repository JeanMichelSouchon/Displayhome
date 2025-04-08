import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la connexion à la base de données
const dbConfig = {
...(process.env.DB_HOST && process.env.DB_HOST.startsWith('/')
    ? { socketPath: process.env.DB_HOST }
    : { host: process.env.DB_HOST}),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
console.log("host:",dbConfig);

// Créer un pool de connexions
const pool = mysql.createPool(dbConfig);

export default pool;