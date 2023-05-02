const mysql = require('mysql')
const config = require('./config.json')

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db,
  })


  const loadUsers = async function(){

   await  connection.query('SELECT userId FROM Ratings ORDER BY userId', async (err, data) => {
        if(err){
            console.log(err);
            return;
        } else {

            
            data = data.map((rating) => {return rating.userId});
           
            //filter for unique users
            const userSet = new Set(data);
            data = [...userSet];
            

            for (const userId of data) {
                
                console.log(userId);
                try {
                    await connection.query('INSERT INTO Users (userid, username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)', [userId, "dummy", "dummy", "dummy", "dummy", "dummy"]);
                } catch (err) {
                    console.log(`Error inserting (${userId}): ${err}`);
                }
            }
            console.log('Finished uploading dummy users.');
        }
    })   

  }
  const loadRatings = async function () {
    //upload dummy users
    await connection.query('SELECT * FROM Ratings ORDER BY userId', async (err, data) => {

        if (err) {
            console.log(err)
        } else {
            data = data.filter((rating) => {
                return rating.rating >= 4.0;
            });

            // Upload (userid, movieid) pairs to FavMovies table
            for (const rating of data) {

                const { userId, movieId } = rating;

                try {
                    console.log("(",userId,","  ,movieId,")");
                    await connection.query(`INSERT INTO FavMovies2 (user_id, movieid) VALUES (?, ?)`, [userId, movieId]);
                    
                } catch (err) {
                    
                    console.log(`Error inserting (${userId}, ${movieId}): ${err}`);
                }
            }

            console.log('Finished uploading (userid, movieid) pairs to FavMovies table.');
        }

    });
}

undoLoadRatings = async function () {

   await connection.query('SELECT * FROM Ratings ORDER BY userId LIMIT 10', async (err, data) => {

        if (err) {
            console.log(err)
        } else {
            data = data.filter((rating) => {
                return rating.rating >= 4.0;
            });

           
            for (const rating of data) {

                const { userId, movieId } = rating;

                try {
                
                    await connection.query(`DELETE FROM FavMovies2 WHERE user_id = ? AND movieid = ?`, [userId, movieId]);
                    
                } catch (err) {
                    console.log(userId,"\n\n\n\n\n")
                    console.log(`Error inserting (${userId}, ${movieId}): ${err}`);
                }
            }

            console.log('Finished deleting (userid, movieid) pairs to FavMovies table.');
        }

    });

    

}

deleteUploadedUsers = async function () {
  await connection.query(`DELETE FROM Users WHERE username='dummy'`, (err, data) => {
        if(err){
            console.log(err);
        };

    })
}

const setup = async function() {
    await loadUsers();
    await loadRatings();
    console.log('Setup complete.');
};

const undoSetup = async function() {
    await undoLoadRatings();
    await deleteUploadedUsers();
    console.log('Undo setup complete.');
};

setup();




