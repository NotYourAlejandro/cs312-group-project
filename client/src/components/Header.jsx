import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const logo = "/logo.png";

function Header({ showSearchBar, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get("search") || "");
  }, [location.search]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/?search=${encodeURIComponent(trimmedQuery)}` : "/");
  };

  const handleQueryChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    if (location.pathname === "/") {
      const trimmedQuery = nextQuery.trim();
      navigate(
        trimmedQuery ? `/?search=${encodeURIComponent(trimmedQuery)}` : "/",
        { replace: true },
      );
    }
  };

  return (
    <nav className="site-header">
      <Link to="/" className="header-logo" aria-label="Go home">
        <img src={logo} alt="StayFinder logo" />
        <span className="header-brand-name">StayFinder</span>
      </Link>

      {showSearchBar && (
        <form className="header-search" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search listings..."
            aria-label="Search listings"
          />

          <button type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.5 3a7.5 7.5 0 015.88 12.8l4.4 4.39a1 1 0 01-1.42 1.42l-4.39-4.4A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
            </svg>
          </button>
        </form>
      )}

      {user ? (
        <div className="header-profile">
          <button
            className="profile-button"
            type="button"
            aria-expanded={menuOpen}
            aria-label="Open profile menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <img src={user.profileImage || user.profilePicture} alt="Profile" />
          </button>

          {menuOpen && (
            <ul className="profile-dropdown">
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/">Log Out</Link>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <div className="header-auth">
          <Link to="/login" className="header-button">
            Log In
          </Link>

          <Link to="/signup" className="header-button header-button-primary">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Header;
