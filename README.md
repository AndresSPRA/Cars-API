# 🚗 Cars-API

**Cars-API** es un servicio backend basado en Node.js y Express que permite gestionar información sobre automóviles. Utiliza MongoDB como base de datos y está dockerizado para facilitar su despliegue.

## 📌 Características

Conexión con MongoDB

Dockerizado con `docker-compose`

API REST con Express

Manejo de errores y logs

---

## 📂 Estructura del Proyecto
```
Cars-API/
├── Backend/
│   ├── index.js        # Archivo principal
│   ├── config.js       # Configuración de la API
│   ├── package.json    # Dependencias y scripts
│   ├── Routes/         # Rutas de la API
│   ├── models/         # Modelos de MongoDB
│   ├── middlewares/    # Middlewares
│   ├── __tests__/      # Pruebas
├── docker-compose.yml  # Configuración Docker
├── Dockerfile          # Imagen del backend
├── README.md           # Documentación del proyecto
```

---

## 🔧 Instalación y Ejecución
### 🐳 Usando Docker
1. **Clona el repositorio**
   ```sh
   git clone https://github.com/tuusuario/Cars-API.git
   cd Cars-API
   ```
2. **Construye y ejecuta los contenedores**
   ```sh
   docker-compose up -d
   ```
3. **Verifica que el backend está corriendo**
   ```sh
   curl http://localhost:8020/api
   ```

### 🖥️ Sin Docker (Modo Manual)
1. **Instala Node.js y MongoDB**
2. **Instala las dependencias**
   ```sh
   cd Backend
   npm install
   ```
3. **Configura el archivo `.env` (si aplica)**
4. **Ejecuta el servidor**
   ```sh
   npm start
   ```

---

## 📡 Endpoints Principales
| Método | Ruta                  | Descripción                                    |
|--------|-----------------------|------------------------------------------------|
| GET    | `/api/cars`           | Obtiene todos los autos                       |
| GET    | `/api/cars/:id`       | Obtiene un auto por ID                        |
| POST   | `/api/cars`           | Crea un nuevo auto                            |
| GET    | `/api/cars/filter`    | Filtra autos por modelo, precio o kilometraje |
| GET    | `/api/brands`         | Obtiene todas las marcas                      |
| POST   | `/api/brands`         | Crea una nueva marca                          |

---

## 🛠 Tecnologías Utilizadas
- **Node.js** + Express 🚀
- **MongoDB** como base de datos 🗄️
- **Docker** y Docker Compose 🐳
- **Jest/Supertest** para pruebas ✅

---

## 📄 Licencia
Este proyecto está bajo la licencia MIT. Puedes usarlo y modificarlo libremente. 🎉

---

## ✉️ Contacto
📧 Email: jenifer.zazpata801@pascualbravo.edu.co - andres.serpa259@pascualbravo.edu.co

🐙 GitHub: [AndresSRPA](https://github.com/AndresSPRA) - [JeniferZapataLuna](https://github.com/JeniferZapataLuna)  

🚀 **¡Contribuciones y mejoras son bienvenidas!**


