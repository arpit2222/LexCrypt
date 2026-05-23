import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <div>
        <strong>LexCrypt</strong>
        <div className="muted">Private Justice Infrastructure</div>
      </div>
      <div className="nav-links">
        <NavLink
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          to="/"
          end
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          to="/whitepaper"
        >
          Whitepaper
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          to="/pitch-deck"
        >
          Pitch Deck
        </NavLink>
      </div>
    </div>
  );
}
