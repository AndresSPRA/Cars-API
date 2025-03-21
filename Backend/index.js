import mongoose from "mongoose";
import express from "express";
import { MONGO_URL, PUERTO } from "./config.js";
import carRouter from "./Routes/carros.js"
import marcaRouter from "./Routes/marca.js";
const app = express()
app.use(express.json())

app.use("/api", carRouter)
app.use("/api", marcaRouter)



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
