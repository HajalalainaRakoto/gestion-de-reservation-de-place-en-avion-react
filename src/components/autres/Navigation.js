import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <>
      <ul className="navbar justify-content-center">
        <NavLink className="nav-link" to="/">
          Accueil
        </NavLink>
        <NavLink className="nav-link" to="/vol">
          Vol
        </NavLink>
        <NavLink className="nav-link" to="/avion">
          Avion
        </NavLink>
        <NavLink className="nav-link" to="/reservation">
          Réservation
        </NavLink>
      </ul>
    </>
  );
};

export default Navigation;
