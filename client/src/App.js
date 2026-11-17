import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Listing from "./pages/listing.jsx";
import "./App.css";
import "./pages/CreateReview.jsx";
import CreateReview from "./pages/CreateReview.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/listings/:id" element={<Listing />} />
        <Route path="/listings/:id/review" element={<CreateReview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
