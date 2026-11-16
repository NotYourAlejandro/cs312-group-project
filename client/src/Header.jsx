import { useState } from "react";

const logo = "/logo.png";

export default function Header({ showSearchBar, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        width: "100%",
        gap: "1rem",
        padding: "0.75rem 1rem",
        boxSizing: "border-box",
        backgroundColor: "green"
      }}
    >
      {/* logo */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "1rem",
        justifySelf: "start",
      }}>
        <img src={logo} alt="Logo" style={{ 
          height: "48px",
          width: "auto",
          borderRadius: "6px",
          display: "block",
          boxShadow: "0px 0px 4px #000000AA"
        }} />
        <h1 style={{
          color: "white",
          fontSize: "32px"
        }}>
          StayFinder
        </h1>

      </div>

      {/* search bar */}
      {showSearchBar && (
        <div
          style={{
            display: "flex",
            justifySelf: "center",
            width: "min(40vw, 32rem)",
            borderRadius: "24px",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            overflow: "hidden",
            border: "2px solid rgba(0, 0, 0, 0.60)",
            background: "white",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              margin: 0,
            }}
          >
            <input type="text" placeholder="Search" style={{
              height: "2rem",
              width: "100%",
              padding: "0.5rem",
              border: "none",
              outline: "none",
              background: "transparent",
            }} />

            {/* TODO: add filters */}

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
                cursor: "pointer",
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
          </form>
        </div>
      )}

      {/* profile dropdown or log in / sign up */}
      {user ? (
        <div className="dropdown" style={{ position: "relative", display: "flex", alignItems: "center", justifySelf: "end" }}>
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            style={{ position: "relative", zIndex: 1, height: "2rem" }}
          >
            <img
              src={user.profilePicture}
              alt="profile pic"
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
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem", justifySelf: "end" }}>
          <a href="/login" className="btn btn-secondary" style={{ backgroundColor: "#FFFFFF", padding: "0.5rem", borderRadius: "4px" }}>Log In</a>
          <a href="/signup" className="btn btn-secondary">Sign Up</a>
        </div>
      )}

    </nav>
  )
}
