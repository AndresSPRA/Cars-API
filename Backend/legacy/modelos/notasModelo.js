import mongoose from "mongoose";

// Esquema que controla las notas
const notaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        default: "New"
    },
    color: {
        type: String,
        default: "#B5D8B3"
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    contenido: {
        type: String,
    }
});

// Esquema que controla las carpetas
const carpetaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        default: 'root'
    },
    notas: [notaSchema]
});


const notasSchema = new mongoose.Schema({
    cedula: {
        type: Number,
        required: true,
        unique: true,
    },
    carpetas: [carpetaSchema]
});


export const Notas = mongoose.model('Notas', notasSchema);
