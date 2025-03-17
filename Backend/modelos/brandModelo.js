import mongoose from "mongoose";

const brandSchema = new mongoose.Schema ({
    brandId: {
        type: Number,
        required: true
    },
    nombreBrand: {
        type: String,
        required: true,
        maxlength: 20,
        unique: true
    }

})

export const Brand = mongoose.model('Brand', brandSchema)

