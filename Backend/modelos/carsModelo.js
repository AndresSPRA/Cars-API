import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
const AutoIncrement = mongooseSequence(mongoose);

const carSchema = new mongoose.Schema({

    _id: Number,
    modelo: {
        type: String,
        required: true,
        lowercase: true,
        maxlength: 30
    },
    descripcion: {
        type: String,
        maxlength: 100
    },
    precio: {
        type: Number,
        min: 0,
        required: true
    },
    kilometraje: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    idBrand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    fechaCreacion: {
        type: Date,
        inmutable: true,
        default: () => Date.now()
    },
    fechaActualizacion: {
        type: Date,
        default: () => Date.now()
    }
});

carSchema.plugin(AutoIncrement, { inc_field: '_id' });

export const Car = mongoose.model('Car', carSchema)

