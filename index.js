const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

app.use(express.static('public_html'));

app.use(express.urlencoded({ extended: true }));

// Middleware for parsing application/json
app.use(express.json());

// persistent file database "myDB".
let db = new sqlite3.Database('myDB');

// Create the JWT signing function
function generateJWT(user) {
    const payload = {
        username: user.username,
        // Add other user-related data if needed
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time (adjust as needed)
    });

    return token;
}
// Handle POST request for login
app.post('/login', async (req, res) => {
    console.log("Request body:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        console.log("Username or password missing in the request");
        return res.status(400).send("Username and password are required");
    }
    // Check username in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (row) {
            // Compare the hashed password
            const passwordMatch = await bcrypt.compare(password, row.password);

            if (passwordMatch) {
                // Passwords match, generate JWT token
                console.log("password is Matched");
                const token = generateJWT(row); // Pass the user data
                const userInfoHTML = `
                    <h1>Welcome to ICONLABS, ${row.full_name}!</h1>
                    <p><strong>Username:</strong> ${row.username}</p>
                    <p><strong>Email:</strong> ${row.email}</p>
                    <p><strong>Address:</strong> ${row.address}</p>
                `;
                
                // Send the HTML response with user info and token
                console.log(username, token);
                res.send(userInfoHTML);
            } else {
                // Passwords don't match
                console.log("don't match ");
                
                console.log("Login failed for username:", username);
                res.send(`
                    <body>
                        <h1>Login Failed</h1>
                        <p>The <em>username</em> or <em>password</em> provided doesn't match our records.</p>
                    </body>
                `);
                console.log("Login Failed");
            }
            
        } else {
            // User not found
            console.log("User not found for username:", username);
            res.send(`
                <body>
                    <h1>User not found</h1>
                    <p>The <em>username</em> provided doesn't exist in our records.</p>
                </body>
            `);


        }
    });
});

// Handle POST request for login
app.post('/luckyDraw', (req, res) => {
    console.log("Request body:", req.body); 
    const { name, email } = req.body;

    // Check email in the database
    db.get('SELECT * FROM luckydraw WHERE email = ?', [email], (err, row) => {
        if (row) {
            // Email exists in database
            console.log("This email tried before", row.email);
            const userInfoHTML = `
                <h2><strong>Sorry, you have tried the lucky draw before ${row.email}</h2>
            `;
            // Send the HTML response with user info
            res.send(userInfoHTML);
        } else {
            // New email
            console.log("Drawing", email);

            let randNum = Math.floor(Math.random() * 5);
            let win;
            let html = "";

            if (randNum === 4) {
                html += `<h1>Congratulations</h1>
                <h5>You are the lucky winner of our lucky Draw!!! You will receive a keyboard. We'll contact you shortly.</h5>`;
                win = 1;
            } else {
                html += `<h1>Sorry, no win.</h1>
                <p>Thank you for participating!</p>`;
                win=0;
            }
            // Insert the name, email, and win into the luckyDraw table
            db.serialize(() => {
                db.run(
                    'INSERT INTO luckydraw (name, email, win) VALUES (?, ?, ?)',
                    name, email, win,
                    (err) => {
                        if (err) {
                            console.error('Error inserting data into luckyDraw:', err);
                        }

                        // Fetch total counts from the luckyDraw table
                        db.get('SELECT COUNT(*) as total, SUM(win) as total_win FROM luckydraw', (err, row) => {
                            const total = row.total;
                            const total_win = row.total_win;

                            html += `<br><p>There are <strong>${total}</strong> people have drawn the lucky draw, with a total of <strong>${total_win}</strong> wins.</p>`;
                            res.send(html);
                        });
                    }
                );
            });
            
        }
    });
});

// insert data into contactus
app.post('/contactus', function (req, res, next) {
    
    const { inputName, inputEmail,inputPhone,subject } = req.body;
    
    console.log("Just received POST data for contactus!");
    console.log(`Data includes: ${inputName}, ${inputEmail},${inputPhone} and ${subject}`);
  
    //insert the form data into the table User
    let stmt = db.run(
        'INSERT INTO contactus (name, email, phone, subject) VALUES (?, ?, ?, ?)',
        inputName, inputEmail, inputPhone, subject
    );
    // still display the default web page in public folder, i.e. index.html, for next data entering 
    // res.status(200).redirect('/contactus.html');  
  });
  
  // REST endpoint for getting all user data
  app.get('/contactus', function (req, res) {
    let html = '';
  
    // HTML code to display a table populated with the data from the DB
    
    html += '<!doctype html><html lang="en">';
    html += '<head>';
    html += '<title>Task10-1 Contact us</title>';
    html += '<meta charset="utf-8">';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
    html += '<link rel="stylesheet"';
    html += '  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css"';
    html += '  integrity="sha384-aFq/bzH65dt+w6FI2ooMVUpc+21e0SRygnTpmBvdBgSdnuTN7QbdgL+OapgHtvPp"';
    html += '  crossorigin="anonymous">';
    html += '</head>';
  
    html += '<body><div class="container">';
    html += '<h3> The Contact Us Form Data Table </h3>';
    html += '<table class="table">';
    html += '<thead class="thead-dark"><tr>';
    html += '<th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Subject</th>';
    html += '<tr></thead><tbody>';
    
    // Retrieve data from table User on the server 
    // and display it in a web page table structure
    db.all('SELECT * FROM contactus', function(err, rows){
        if (err) {
            return console.error(err.message);
        }
        if (rows.length === 0) { 
            console.log("Array is empty!") 
            html += '<tr><td colspan="5"> No data found </td></tr>';
        } else {
            rows.forEach(function (row){
                html += '<tr>';
                html += '<td>'+row.id+'</td>';
                html += '<td>'+row.name+'</td>';
                html += '<td>'+row.email+'</td>';
                html += '<td>'+row.phone+'</td>';
                html += '<td>'+row.subject+'</td></tr>';
  
            });
        }
  
        html += '</tbody></table>';
        html += '</div>';
        html += '</body></html>';
        res.send( html );
    });
  });

// // Start the server
// app.listen(port, () => {
//     console.log(`Web server running at: http://localhost:${port}`);
//     console.log("Type Ctrl+C to shut down the web server");
// });
// Start the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Web server running at: http://localhost:${port}`);
        console.log("Type Ctrl+C to shut down the web server");
    });
}

module.exports = app;