import mysql from 'mysql2';

let db;

export function connectToDB() {
    if (!db) {
        db = mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log(`db name: ${process.env.DB_NAME}`);
        
        db.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return;
            }
            console.log('Connected to the MySQL database.');
        });
    }

    return db;
}
