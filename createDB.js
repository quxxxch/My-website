const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

let db = new sqlite3.Database('myDB');

// Create a table to store data
db.serialize(function () {

    // Create users table
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        full_name TEXT,
        address TEXT,
        email TEXT UNIQUE
    )
  `);

    // Populate the table with sample data
    const usersData = [
        { username: 'mickeym', password: 'cheese123', full_name: 'Mickey Mouse', address: '70 Elgar Rd', email: 'mickeym@gmail.com' },
        { username: 'alfred', password: 'pm1903aus', full_name: 'Alfred Deakin', address: '70 Elgar Rd', email: 'alfred@gmail.com' },
        { username: 'jane', password: 'qwerty', full_name: 'Jane Smith', address: '70 Elgar Rd', email: 'jane@gmail.com' },
        { username: 'john', password: 'brian1979', full_name: 'John Cleese', address: '70 Elgar Rd', email: 'john@gmail.com' },
        { username: 'terry', password: 'montyp1969', full_name: 'Terry Jones', address: '70 Elgar Rd', email: 'terry@gmail.com' },
    ];

    const insertUser = db.prepare(`
    INSERT INTO users (username, password, full_name, address, email) VALUES (?, ?, ?, ?, ?)
`);

    async function insertUsers() {
        for (const user of usersData) {
            try {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                insertUser.run(user.username, hashedPassword, user.full_name, user.address, user.email);
                console.log(`User ${user.username} added successfully.`);
            } catch (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    console.error(`A user with the email ${user.email} already exists.`);
                } else {
                    console.error(err); // Handle other types of errors
                }
            }
        }
        insertUser.finalize();
    }

    insertUsers();

    // Create contact table
    db.run(`
            CREATE TABLE IF NOT EXISTS contactus (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                phone NUMBER,
                subject TEXT
            )
        `);

    // Create contact table
    db.run(`
        CREATE TABLE IF NOT EXISTS luckydraw (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            win INTEGER
        )
        `);

});

// Close the database connection after a short delay
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err);
        } else {
            console.log('Database closed successfully.');
        }
    });
}, 1000); // Adjust the delay as needed
