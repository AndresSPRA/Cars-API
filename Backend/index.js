import mongoose from "mongoose";
import express from "express";
import { MONGO_URL, PUERTO } from "./config.js";
import carRouter from "./Routes/carros.js"
import marcaRouter from "./Routes/marca.js";


const app = express()
app.use(express.json())
app.use("/api", carRouter)
app.use("/api", marcaRouter)
// // Get default
// app.get("/api/", (req, res) => res.send("Hello World!"));

// // Post para crear autos


// app.post("/api/marca", async (req, res) => {
//   try {
//     const { nombreBrand } = req.body; // Extraer nombre de la marca

//     // Verificar que el nombre no esté vacío
//     if (!nombreBrand) {
//       return res
//         .status(400)
//         .json({ message: "El nombre de la marca es obligatorio" });
//     }

//     // Crear la nueva marca en la base de datos
//     const newBrand = await Brand.create({ nombreBrand });

//     res
//       .status(201)
//       .json({ message: "Marca creada exitosamente", brand: newBrand });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Error al crear la marca", error: error.message });
//   }
// });

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
