import request from "supertest";
import {app, server} from "../index.js";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { Brand } from "../modelos/brandModelo";

describe("POST /api/createBrand", () => {
  
    afterEach(() => {
      jest.restoreAllMocks(); // Restaurar todos los mocks después de cada prueba
    });
  
    it("Debe crear una marca correctamente (201)", async () => {
      const mockBrand = { nombreBrand: "Toyota" };
  
      jest.spyOn(Brand, "findOne").mockResolvedValue(null); // Simula que la marca no existe
      jest.spyOn(Brand, "create").mockResolvedValue(mockBrand); // Simula la creación de la marca
  
      const res = await request(app).post("/api/createBrand").send(mockBrand);
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Marca creada exitosamente");
      expect(res.body.brand).toHaveProperty("nombreBrand", "Toyota");
    });
  
    it("Debe rechazar si falta el nombre (400)", async () => {
      const res = await request(app).post("/api/createBrand").send({});
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "El nombre de la marca es obligatorio");
    });
  
    it("Debe rechazar si la marca ya existe (409)", async () => {
      const mockBrand = { nombreBrand: "Toyota" };
  
      jest.spyOn(Brand, "findOne").mockResolvedValue(mockBrand); // Simula que la marca ya existe
  
      const res = await request(app).post("/api/createBrand").send(mockBrand);
  
      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty("message", "La marca ya existe");
    });
  });

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});