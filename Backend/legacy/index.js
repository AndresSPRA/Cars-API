import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { MONGO_URL, PUERTO, KEY_U } from '../config.js';
import { Usuario } from './modelos/usuarioModelo.js';
import { Notas } from './modelos/notasModelo.js';


const app = express();
app.use(express.json());
app.use(cookieParser());

// Middleware para verificar el contenido de las cookies
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ mensaje: 'No se proporcionó un token' });
  }
  jwt.verify(token, KEY_U, (err, decoded) => {
    if (err) {
      return res.status(401).send({ mensaje: 'Token inválido' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Obtener la lista de usuarios
app.get('/api/usuarios', verifyToken, async (solicitud, respuesta) => {
  try {
    const users = await Usuario.find();
    return respuesta.status(200).send(users);
  } catch (error) {
    console.log(error);
    return respuesta.status(500).send({ message: error.message });
  }
});

// Registrar Usuarios
app.post('/api/registrar', async (solicitud, respuesta) => {
  try {
    let { nombre, email, cedula, contrasena } = solicitud.body;
    if (!nombre || !email || !cedula || !contrasena) {
      return respuesta.status(400).send('Ingresar todos los datos');
    }

    const existeUsuario = await Usuario.findOne({ $or: [{ email }, { cedula }] });
    if (existeUsuario) {
      return respuesta.status(200).send({ mensaje: 'El Usuario ya existe' });
    } else {
      const user = await Usuario.create({ nombre, email, cedula, contrasena });

      // Crear la carpeta root para el nuevo usuario
      const notas = new Notas({
        cedula,
        carpetas: [
          {
            nombre: 'root',
            notas: []
          }
        ]
      });
      await notas.save();

      return respuesta.status(201).send({ user });
    }
  } catch (error) {
    console.log(error);
    return respuesta.status(500).send({ message: error.message });
  }
});

// Actualizar usuario
app.put('/api/actualizar/:id', verifyToken, async (solicitud, respuesta) => {
  try {
    const { id } = solicitud.params;
    const { nombre, email, cedula, contrasena } = solicitud.body;
    if (!nombre || !email || !cedula || !contrasena) {
      return respuesta.status(400).send('Ingresar todos los datos');
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { nombre, email, cedula, contrasena },
      { new: true }
    );

    if (!usuarioActualizado) {
      return respuesta.status(404).send({ mensaje: 'Usuario no encontrado' });
    }

    return respuesta.status(200).send({ usuario: usuarioActualizado });
  } catch (error) {
    console.log(error);
    return respuesta.status(500).send({ message: error.message });
  }
});

// Eliminar usuario
app.delete('/api/eliminar/:id', verifyToken, async (solicitud, respuesta) => {
  try {
    const { id } = solicitud.params;
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return respuesta.status(404).send({ mensaje: 'Usuario no encontrado' });
    }

    return respuesta.status(200).send({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.log(error);
    return respuesta.status(500).send({ message: error.message });
  }
});

// Iniciar sesión
app.post('/api/login', async (solicitud, respuesta) => {
  try {
    const { email, contrasena } = solicitud.body;

    if (!email || !contrasena) {
      return respuesta.status(400).send('Ingresar todos los datos');
    }

    const user = await Usuario.findOne({ email });

    if (!user) {
      return respuesta.status(400).send({ mensaje: 'Usuario no encontrado' });
    }

    const isMatch = await user.matchPassword(contrasena);

    if (!isMatch) {
      return respuesta.status(400).send({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id, cedula: user.cedula }, KEY_U, { expiresIn: '30m' });

    // Enviar el mensaje de exito y su token para generar la cookie posteriormente
    return respuesta.status(200).send({ mensaje: 'Inicio de sesión exitoso', token: token, cedula: user.cedula});
  } catch (error) {
    console.log(error);
    return respuesta.status(500).send({ message: error.message});
  }
});

// Obtener notas de un usuario
app.get('/api/usuarios/:cedula/carpetas/:carpetaNombre/notas', verifyToken, async (req, res) => {
  try {
    const { cedula, carpetaNombre } = req.params;

    const usuario = await Notas.findOne({ cedula });

    if (!usuario) {
      return res.status(404).send({ mensaje: 'Usuario no encontrado' });
    }

    const carpeta = usuario.carpetas.find(c => c.nombre === carpetaNombre);

    if (!carpeta) {
      return res.status(404).send({ mensaje: 'Carpeta no encontrada' });
    }

    res.status(200).send(carpeta.notas);
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: error.message });
  }
});

// Crear una nueva nota en una carpeta específica
app.post('/api/usuarios/:cedula/carpetas/:carpetaNombre/notas', verifyToken, async (req, res) => {
  try {
    const { cedula, carpetaNombre } = req.params;
    const { titulo, color, contenido } = req.body;

    const usuario = await Notas.findOne({ cedula });

    if (!usuario) {
      return res.status(404).send({ mensaje: 'Usuario no encontrado' });
    }

    const carpeta = usuario.carpetas.find(c => c.nombre === carpetaNombre);

    if (!carpeta) {
      return res.status(404).send({ mensaje: 'Carpeta no encontrada' });
    }

    const nuevaNota = { titulo, color, contenido };
    carpeta.notas.push(nuevaNota);
    await usuario.save();

    res.status(201).send({ mensaje: 'Nota creada', nota: nuevaNota });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: error.message });
  }
});

// Actualizar una nota específica en una carpeta específica
app.put('/api/usuarios/:cedula/carpetas/:carpetaNombre/notas/:notaId', verifyToken, async (req, res) => {
  try {
    const { cedula, carpetaNombre, notaId } = req.params;
    const { titulo, color, contenido } = req.body;

    const usuario = await Notas.findOne({ cedula });

    if (!usuario) {
      return res.status(404).send({ mensaje: 'Usuario no encontrado' });
    }

    const carpeta = usuario.carpetas.find(c => c.nombre === carpetaNombre);

    if (!carpeta) {
      return res.status(404).send({ mensaje: 'Carpeta no encontrada' });
    }

    const nota = carpeta.notas.id(notaId);

    if (!nota) {
      return res.status(404).send({ mensaje: 'Nota no encontrada' });
    }

    nota.titulo = titulo || nota.titulo;
    nota.color = color || nota.color;
    nota.contenido = contenido || nota.contenido;

    await usuario.save();

    res.status(200).send({ mensaje: 'Nota actualizada', nota });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: error.message });
  }
});

// Eliminar una nota específica en una carpeta específica
app.delete('/api/usuarios/:cedula/carpetas/:carpetaNombre/notas/:notaId', verifyToken, async (req, res) => {
  try {
    const { cedula, carpetaNombre, notaId } = req.params;

    const usuario = await Notas.findOne({ cedula });

    if (!usuario) {
      return res.status(404).send({ mensaje: 'Usuario no encontrado' });
    }

    const carpeta = usuario.carpetas.find(c => c.nombre === carpetaNombre);

    if (!carpeta) {
      return res.status(404).send({ mensaje: 'Carpeta no encontrada' });
    }

    const nota = carpeta.notas.id(notaId);

    if (!nota) {
      return res.status(404).send({ mensaje: 'Nota no encontrada' });
    }

    // Usar pull para eliminar la nota
    carpeta.notas.pull(notaId);
    await usuario.save();

    res.status(200).send({ mensaje: 'Nota eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: error.message });
  }
});

// Buscar notas por título o contenido
app.get('/api/usuarios/:cedula/carpetas/:carpetaNombre/notas/buscar', verifyToken, async (req, res) => {
  try {
    const { cedula, carpetaNombre } = req.params;
    const { query } = req.query;

    const usuario = await Notas.findOne({ cedula });

    if (!usuario) {
      return res.status(404).send({ mensaje: 'Usuario no encontrado' });
    }

    const carpeta = usuario.carpetas.find(c => c.nombre === carpetaNombre);

    if (!carpeta) {
      return res.status(404).send({ mensaje: 'Carpeta no encontrada' });
    }

    const notasEncontradas = carpeta.notas.filter(nota => 
      nota.titulo.includes(query) || nota.contenido.includes(query)
    );

    res.status(200).send(notasEncontradas);
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: error.message });
  }
});




// Conectar a la base de datos y arrancar el servidor
mongoose.connect(MONGO_URL)
  .then(() => {
    app.listen(PUERTO, () => {
      console.log(`App arriba en el puerto ${PUERTO}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
