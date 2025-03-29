import { useState } from "react";

function AddCarForm() {
  const [formData, setFormData] = useState({
    modelo: "",
    descripcion: "",
    precio: "",
    kilometraje: "",
    marca: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8020/api/createCar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo: formData.modelo,
          descripcion: formData.descripcion,
          precio: Number(formData.precio),
          kilometraje: Number(formData.kilometraje),
          marca: formData.marca,
        }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      alert("Auto agregado con éxito");
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("No se pudo agregar el auto. Verifica la API.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="modelo" placeholder="Modelo" onChange={handleChange} required />
      <input type="text" name="descripcion" placeholder="Descripción" onChange={handleChange} required />
      <input type="number" name="precio" placeholder="Precio" onChange={handleChange} required />
      <input type="number" name="kilometraje" placeholder="Kilometraje" onChange={handleChange} required />
      <input type="text" name="marca" placeholder="Marca" onChange={handleChange} required />
      <button type="submit">Agregar Auto</button>
    </form>
  );
}

export default AddCarForm;
