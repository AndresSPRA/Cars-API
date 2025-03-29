import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Bienvenido a la App</h1>
      <nav>
        <ul>
          <li><Link to="/add-car">Agregar Auto</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
