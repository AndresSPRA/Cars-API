import { Router } from "express"
import { Car } from "../modelos/carsModelo.js";
import { Brand } from "../modelos/brandModelo.js";

const carRouter = Router()

carRouter.get("/autos", async (req, res) => {
  try {
    // Buscar todos los autos y poblar la información de la marca
    const cars = await Car.find().populate("idBrand", "nombreBrand");

    if (cars.length === 0) {
      return res.status(404).send({ message: "No hay autos registrados" });
    }

    return res.status(200).send({ cars });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
})

carRouter.post("/crear", async (req, res) => {
  try {
    // Extraer los datos de la solicitud
    let { modelo, descripcion, precio, kilometraje, marca } = req.body
    let idBrand;

    // Si hay datos faltantes, rechazar la solicitud
    if (!modelo || !descripcion || !precio || !kilometraje || !marca) {
      return res.status(400).send("Ingresar todos los datos")
    }

    // Obtener el identificador de la marca
    const marcaEncontrada = await Brand.findOne({ nombreBrand: "toyota" })
    if (!marcaEncontrada) {
      return res.status(404).send({ message: "Marca no encontrada" })
    }

    idBrand = marcaEncontrada._id;

    // Crear nuevo carro
    const car = await Car.create({
      modelo,
      descripcion,
      precio,
      kilometraje,
      idBrand,
    });
    return res.status(201).send({ car })
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message })
  }
})

carRouter.get("/auto/:id", async (req, res) => {
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



export default carRouter