import mongoose from "mongoose";
import express from "express";
import { MONGO_URL, PUERTO } from './config.js';
import { Car } from './modelos/carsModelo.js';
import { Brand } from './modelos/brandModelo.js'

const app = express()
app.use(express.json());


// Get default
app.get('/api/', (req, res) => res.send('Hello World!'))


// Post para crear autos
app.post('/api/crearAuto', async (req, res)  => {
    
    try {
    // Extraer los datos de la solicitud
    let { modelo, descripcion, precio, kilometraje, marca} = req.body;
    
    // Si hay datos faltantes, rechazar la solicitud
    if (!modelo || !descripcion || !precio || !kilometraje) {
        return res.status(400).send('Ingresar todos los datos');
    }

    // Crear nuevo carro
    const car = await Car.create({ modelo, descripcion, precio, kilometraje, marca});
    return res.status(201).send({ car });


    }catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message});
    }
    


});
































// Conectar a la base de datos y arrancar el servidor
mongoose.connect(MONGO_URL)
  .then(() => {
    app.listen(PUERTO, () => {
      console.log(`App arriba en el puerto ${PUERTO}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
