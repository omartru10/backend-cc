const express = require('express');
const { dbConection } = require('./database/config.js');
require('dotenv').config();

const cors = require('cors');

// crear el servidor de express
const app = express();
//base de datos
dbConection();

//CORS
app.use(cors())

//directorio publico
app.use(express.static('public'));

//lectura de parseo body
app.use(express.json());

// rutas
// de todo
app.use('/api/outh', require('./routes/outh.js'));


app.use('/api/events', require('./routes/events.js'));


// Escuchar Peticion
app.listen(process.env.PORT,()=>{
    const puerto = process.env.PORT;
    console.log('servidor corriendo en puerto '+puerto);
    
});