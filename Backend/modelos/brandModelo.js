import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
const AutoIncrement = mongooseSequence(mongoose);

const brandSchema = new mongoose.Schema ({
    _idBrand: Number,
    nombreBrand: {
        type: String,
        required: true,
        maxlength: 20,
        lowercase: true,
        unique: true
    }

});

brandSchema.plugin(AutoIncrement, { inc_field: '_idBrand' });

export const Brand = mongoose.model('Brand', brandSchema)

