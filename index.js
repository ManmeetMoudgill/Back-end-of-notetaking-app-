const mongooseConnection=require('./db');
//importing the express module
const express = require('express')


const cors=require('cors');


//function for connection to the local mongo database
mongooseConnection();

const app = express()
const port = 80
app.use(express.json());
app.use(cors());


//creating routes 
app.use('/api/v1/auth',require('./routes/auth.js'));
app.use('/api/v1/notes',require('./routes/notes.js'));


//IN ORDER TO GET THE RESPONSE BACK FROM THE API WE NEED TO USE A MIDLLEWARE
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})