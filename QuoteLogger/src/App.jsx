import { Outlet } from "react-router-dom";
import NavBar from "./components/layout/NavBar.jsx";

function App() {
  return (
    <>
      <NavBar/>
      <main>
        <Outlet/>
      </main>
    </>
  );
}

export default App
