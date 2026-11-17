import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ListingGrid from "../components/ListingGrid";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetch("/api/listings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load listings.");
        }
        return response.json();
      })
      .then((data) => setListings(data))
      .catch(() => setError("Unable to load listings right now."))
      .finally(() => setLoading(false));
  }, []);

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("search") || "").trim().toLowerCase();
  }, [location.search]);

  const filteredListings = useMemo(() => {
    if (!searchQuery) {
      return listings;
    }

    return listings.filter((listing) => {
      const textToSearch = [
        listing.name,
        listing.description,
        listing.location,
        (listing.amenities || []).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return textToSearch.includes(searchQuery);
    });
  }, [listings, searchQuery]);

  if (loading) {
    return <main className="home-page"><div className="home-state">Loading listings...</div></main>;
  }

  if (error) {
    return <main className="home-page"><div className="home-state error">{error}</div></main>;
  }

  return (
    <main className="home-page">
      {filteredListings.length === 0 ? (
        <div className="home-state">No listings match your search right now.</div>
      ) : (
        <ListingGrid listings={filteredListings} />
      )}
    </main>
  );
}

export default Home;
