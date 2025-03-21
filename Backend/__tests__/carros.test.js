import request from "supertest";
import {app, server} from "../index.js";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { Car } from "../modelos/carsModelo.js";
import { Brand } from "../modelos/brandModelo";


describe("GET /api/getCar", () => {
  it("debe responder con un array de autos", async () => {
    const res = await request(app).get("/api/getCar");
    
    expect(res.statusCode).toBe(200);
    expect(res.body.cars).toBeInstanceOf(Array);
  });
});

describe("GET /api/getCar", () => {
  it("debe manejar un error de la base de datos y devolver 500", async () => {
    // Mockea `find` para que devuelva un error
    jest.spyOn(Car, "find").mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Fallo en la DB")),
    });

    const res = await request(app).get("/api/getCar");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: "Error del servidor",
      error: "Fallo en la DB",
    });

    // Restaura el método original después de la prueba
    Car.find.mockRestore();
  });
});

describe("GET /api/filterCars", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restaura los mocks después de cada prueba
  });

  it("debe filtrar autos por modelo", async () => {
    const mockCars = [
      { _id: "1", modelo: "Toyota Corolla", precio: 20000, kilometraje: 50000, idBrand: { nombreBrand: "Toyota" } },
      { _id: "2", modelo: "Toyota Yaris", precio: 18000, kilometraje: 30000, idBrand: { nombreBrand: "Toyota" } }
    ];

    jest.spyOn(Car, "find").mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCars),
    });

    const res = await request(app).get("/api/filterCars?modelo=Toyota");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("cars");
    expect(res.body.cars).toHaveLength(2);
    expect(res.body.cars[0].modelo).toMatch(/Toyota/i);
  });

  it("debe devolver 404 si no hay autos que coincidan con los filtros", async () => {
    jest.spyOn(Car, "find").mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });

    const res = await request(app).get("/api/filterCars?modelo=Ferrari");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "No se encontraron autos con los filtros proporcionados" });
  });

  it("debe manejar errores de la base de datos y devolver 500", async () => {
    jest.spyOn(Car, "find").mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Fallo en la DB")),
    });

    const res = await request(app).get("/api/filterCars?modelo=Toyota");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: "Error del servidor",
      error: "Fallo en la DB",
    });
  });
});

describe("POST /api/createCar", () => {
  beforeEach(() => {
    jest.restoreAllMocks(); // Restaurar los mocks antes de cada prueba
  });

  it("Debe crear un auto correctamente", async () => {
    // Simular que existe una marca en la BD
    const mockBrand = { _id: "65f1b2e4d1234a001c5d6789", nombreBrand: "Toyota" };
    jest.spyOn(Brand, "findOne").mockResolvedValue(mockBrand);

    // Simular la creación del auto en la BD
    const mockCar = {
      _id: "123abc456def",
      modelo: "Corolla",
      descripcion: "Auto compacto",
      precio: 20000,
      kilometraje: 50000,
      idBrand: mockBrand._id,
    };
    jest.spyOn(Car, "create").mockResolvedValue(mockCar);

    const res = await request(app).post("/api/createCar").send({
      modelo: "Corolla",
      descripcion: "Auto compacto",
      precio: 20000,
      kilometraje: 50000,
      marca: "Toyota",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.car).toHaveProperty("modelo", "Corolla");
  });

  it("Debe devolver error 400 si faltan datos", async () => {
    const res = await request(app).post("/api/createCar").send({
      modelo: "Corolla",
      descripcion: "Auto compacto",
      precio: 20000,
      // Falta kilometraje y marca
    });

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("Ingresar todos los datos");
  });

  it("Debe devolver error 404 si la marca no existe", async () => {
    jest.spyOn(Brand, "findOne").mockResolvedValue(null);

    const res = await request(app).post("/api/createCar").send({
      modelo: "Corolla",
      descripcion: "Auto compacto",
      precio: 20000,
      kilometraje: 50000,
      marca: "MarcaInexistente",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Marca no encontrada");
  });

  it("Debe manejar errores del servidor", async () => {
    jest.spyOn(Brand, "findOne").mockRejectedValue(new Error("Error de BD"));

    const res = await request(app).post("/api/createCar").send({
      modelo: "Corolla",
      descripcion: "Auto compacto",
      precio: 20000,
      kilometraje: 50000,
      marca: "Toyota",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Error del servidor");
    expect(res.body).toHaveProperty("error", "Error de BD");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});