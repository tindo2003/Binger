const mysql = require('mysql')
const config = require('./config.json')

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db,
  })



  const loadUsers = async function() {
    for (let userId = 0; userId < 100; userId++) {
        connection.query(`INSERT INTO Users (userid, username, password, email, first_name, last_name) VALUES (? , 'dummy', 'dummy', 'dummy', 'dummy', 'dummy')`
        , [userId], (err, data) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(userId);
            }
        }); // This closing parenthesis was missing
    }
}

const unloadUsers = async function() {
    for (let userId = 0; userId < 100; userId++) {
        connection.query(`DELETE FROM Users WHERE userid = ? AND username = 'dummy' AND password = 'dummy' AND email = 'dummy' AND first_name = 'dummy' AND last_name = 'dummy'`
        , [userId], (err, data) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("Deleted user with ID:", userId);
            }
        });
    }
}

const insertRandomFavMovies = async function(n) {
    // Get the list of movie IDs from the Movies table
    connection.query('SELECT show_id FROM AHND_Table', (err, movieData) => {
        if (err) {
            console.log(err);
            return;
        }

        // Generate the bulk insert query
        let bulkInsertQuery = 'INSERT INTO FavMovies2 (user_id, movieid) VALUES ';

        const movieIds = movieData.map(row => row.show_id);
        const uniqueConnections = new Set();

        while (uniqueConnections.size < n) {
            const randomUserId = Math.floor(Math.random() * 100);
            const randomMovieId = movieIds[Math.floor(Math.random() * movieIds.length)];

            // Check for duplicate connections and store unique ones
            const connectionStr = `${randomUserId}-${randomMovieId}`;
            if (!uniqueConnections.has(connectionStr)) {
                uniqueConnections.add(connectionStr);
                bulkInsertQuery += `(${randomUserId}, ${randomMovieId})`;

                if (uniqueConnections.size < n) {
                    bulkInsertQuery += ', ';
                }
            }
        }

        // Execute the bulk insert query
        connection.query(bulkInsertQuery, (err, insertData) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(`Inserted ${n} random connections into FavMovies2`);
            }
        });
    });
}


unloadUsers();



      