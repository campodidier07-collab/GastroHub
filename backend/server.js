require('dotenv').config();
const express = require('express');
const cors = require('cors');
const api = require('./Routes/api');
const conectarDB = require('./config/database');

const app = express();
conectarDB();

app.use(cors());
app.use(express.json());

app.use('/api/recetas', api);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
