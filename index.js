const express = require('express')

const cors =require('cors');


require('dotenv').config(); 

const app = express()


app.use(cors());
app.use(express.urlencoded({extended: false}))


const routes= require('./routes/routes');

app.use(routes)
  
   

          
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })