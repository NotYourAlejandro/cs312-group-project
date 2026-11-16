import { useState } from "react";

const logo = "/logo.png";

function Header({ showSearchBar, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="site-header">
      {/* Logo */}
      <a href="/" className="header-logo">
        <img src={logo} alt="Logo" />
      </a>

      {/* Search bar */}
      {showSearchBar && (
        <form className="header-search">
          <input type="text" placeholder="Search listings..." />

          <button type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.5 3a7.5 7.5 0 015.88 12.8l4.4 4.39a1 1 0 01-1.42 1.42l-4.39-4.4A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
            </svg>
          </button>
        </form>
      )}

      {/* Profile or authentication links */}
      {user ? (
        <div className="header-profile">
          <button
            className="profile-button"
            type="button"
            aria-expanded={menuOpen}
            aria-label="Open profile menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <img src={user.profilePicture} alt="Profile" />
          </button>

          {menuOpen && (
            <ul className="profile-dropdown">
              <li>
                <a href="/profile">Profile</a>
              </li>
              <li>
                <a href="/logout">Log Out</a>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <div className="header-auth">
          <a href="/login" className="header-button">
            Log In
          </a>

          <a href="/signup" className="header-button header-button-primary">
            Sign Up
          </a>
        </div>
      )}
    </nav>
  );
}

export default Header;
