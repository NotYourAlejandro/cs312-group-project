import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Listing from "./pages/listing.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    // fetch current user info
    fetch("/api/users/1").then(
      response => response.json()
    ).then(
      data => setUser(data)
    )
  }, [])

  return (
    <BrowserRouter>
      <Header
        showSearchBar={true}
        user={user}
      />
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/listings/:id" element={<Listing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
