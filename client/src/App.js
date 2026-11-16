import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Listing from "./pages/listing.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/listings/:id" element={<Listing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
