import { Router } from "express"
import { Brand } from "../modelos/brandModelo.js"

const marcaRouter = Router()

marcaRouter.post("/marca", async (req, res) => {
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


  export default marcaRouter