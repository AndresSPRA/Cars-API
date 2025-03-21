import fs from "fs";
import path from "path";

const logDir = "logs";
const logFilePath = path.join(logDir, "requests.log");

// Crear la carpeta logs si no existe
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logRequest = (req, res, next) => {
  const clientIp = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Obtener la IP
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${clientIp}\n`;

  // Guardar en el archivo
  fs.appendFile(logFilePath, log, (err) => {
    if (err) {
      console.error("Error al escribir el log:", err);
    }
  });

  console.log(log.trim()); // También mostrarlo en consola
  next(); // Continuar con la petición
};

export default logRequest;
