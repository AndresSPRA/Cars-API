import { Router } from "express";
import { Brand } from "../modelos/brandModelo.js";

const brandRouter = Router();

brandRouter.post("/createBrand", async (req, res) => {
  try {
    const { nombreBrand } = req.body;

    // Verificar que el nombre no esté vacío
    if (!nombreBrand) {
      return res.status(400).json({ message: "El nombre de la marca es obligatorio" });
    }

    // Verificar si la marca ya existe
    const existingBrand = await Brand.findOne({ nombreBrand });
    if (existingBrand) {
      return res.status(409).json({ message: "La marca ya existe" });
    }

    // Crear la nueva marca
    const newBrand = await Brand.create({ nombreBrand });

    res.status(201).json({ message: "Marca creada exitosamente", brand: newBrand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
});

export default brandRouter;