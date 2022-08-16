const express = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

/* Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');*/

    app.get('/', (req, res) => {
        res.json({
          message: 'Hello World'
        });
      });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
    res.status(404).end();
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  //});