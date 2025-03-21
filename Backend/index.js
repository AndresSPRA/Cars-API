import mongoose from "mongoose";
import express from "express";
import { MONGO_URL, PUERTO } from "./config.js";
import carRouter from "./Routes/carros.js"
import brandRouter from "./Routes/marca.js";
import logRequest from "./middlewares/logger.js";

const app = express()
app.use(express.json())

app.use(logRequest);

app.use("/api", carRouter)
app.use("/api", brandRouter)



let server; 

mongoose
  .connect(MONGO_URL)
  .then(() => {
    server = app.listen(PUERTO, () => {
      console.log(`App arriba en el puerto ${PUERTO}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });


  export { app, server };
