import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Listing from "./pages/listing.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./Profile.jsx";
import CreateReview from "./pages/CreateReview.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/users/1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load user.");
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <BrowserRouter>
      <Header showSearchBar={true} user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings/:id" element={<Listing />} />
        <Route path="/listings/:id/review" element={<CreateReview />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
