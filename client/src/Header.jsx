import { useState } from "react";

const logo = "/logo.png";

export default function Header({ showSearchBar, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: "1rem",
        padding: "0.75rem 1rem",
        boxSizing: "border-box",
        backgroundColor: "green"
      }}
    >
      {/* logo */}
      <img src={logo} alt="Logo" style={{ 
        height: "48px",
        width: "auto",
        borderRadius: "6px",
        display: "block",
        boxShadow: "0px 0px 4px #000000AA"
      }} />

      {/* search bar */}
      {showSearchBar && (
        <form
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0rem",
            margin: 0,
            borderRadius: "6px",
            border: "4px"
          }}
        >
          <input type="text" placeholder="Search" style={{
            height: "2rem",
            width: "20rem",
            padding: "0.5rem 0.5rem 0.5rem 0.5rem",
            border: "none",
            outline: "none",
          }} />
          <button
            type="submit"
            aria-label="Search"
            style={{
              height: "3rem",
              width: "3rem",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              background: "white",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ width: "1rem", height: "1rem", fill: "currentColor" }}
            >
              <path d="M10.5 3a7.5 7.5 0 015.88 12.8l4.4 4.39a1 1 0 01-1.42 1.42l-4.39-4.4A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
            </svg>
          </button>

          {/* TODO: add filters */}
        </form>
      )}

      {/* profile dropdown or log in / sign up */}
      {user ? (
        <div className="dropdown" style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            style={{ position: "relative", zIndex: 1, height: "2rem" }}
          >
            <img
              src={user.profilePicture}
              alt="profile picture"
            />
          </button>

          {menuOpen && (
            <ul
              className="dropdown-menu show"
              style={{
                display: "block",
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                right: 0,
                minWidth: "12rem",
                listStyle: "none",
                padding: "0.5rem 0",
                margin: 0,
                backgroundColor: "white",
                border: "1px solid grey",
                borderRadius: "0.25rem",
                boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.175)",
                zIndex: 99,
              }}
            >
              <li><a className="dropdown-item" href="/profile">Profile</a></li>
              <li><a className="dropdown-item" href="/logout">Log Out</a></li>
            </ul>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <a href="/login" className="btn btn-secondary">Log In</a>
          <a href="/signup" className="btn btn-secondary">Sign Up</a>
        </div>
      )}

    </nav>
  )
}