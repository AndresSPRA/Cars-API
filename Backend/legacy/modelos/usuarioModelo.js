import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cedula: {
    type: Number,
    required: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
});

// Encriptar la contraseña antes de guardarla
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('contrasena')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.contrasena);
};

export const Usuario = mongoose.model('Usuario', usuarioSchema);
