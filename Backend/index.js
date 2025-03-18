import mongoose from "mongoose";
import express from "express";
import { MONGO_URL, PUERTO } from "./config.js";

import carRouter from "./Routes/carros.js"


const app = express();
app.use(express.json());

// Get default
app.get("/api/", (req, res) => res.send("Hello World!"));

// Post para crear autos


app.post("/api/marca", async (req, res) => {
  try {
    const { nombreBrand } = req.body; // Extraer nombre de la marca

    // Verificar que el nombre no esté vacío
    if (!nombreBrand) {
      return res
        .status(400)
        .json({ message: "El nombre de la marca es obligatorio" });
    }

    // Crear la nueva marca en la base de datos
    const newBrand = await Brand.create({ nombreBrand });

    res
      .status(201)
      .json({ message: "Marca creada exitosamente", brand: newBrand });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al crear la marca", error: error.message });
  }
});

app.get("/api/auto/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el auto y poblar la marca
    const car = await Car.findById(id).populate("idBrand", "nombreBrand");

    if (!car) {
      return res.status(404).send({ message: "Auto no encontrado" });
    }

    return res.status(200).send({ car });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
});




app.use("/api", carRouter)























mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PUERTO, () => {
      console.log(`App arriba en el puerto ${PUERTO}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
