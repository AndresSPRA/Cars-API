import { Routes, Route } from "react-router-dom";
import AddCarForm from "./components/addCarForm";
import Home from "./Pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-car" element={<AddCarForm />} />
    </Routes>
  );
}

export default App;