import "./App.css";
import Home from "./components/Home";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Verification from "./components/Verification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/verification" element={<Verification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
