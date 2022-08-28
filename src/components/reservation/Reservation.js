import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../autres/Navigation";

const Reservation = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/reservation").then((res) => {
      setData(res.data);
    });
  }, []);
  return (
    <>
      <Navigation />
      <table className="table table-striped table-borderless text-center">
        <thead>
          <tr>
            <th>Numéro réservation</th>
            <th>Numéro avion</th>
            <th>Numéro de place</th>
            <th>Date réservation</th>
            <th>Nom du voyageur</th>
            <th>
              <NavLink to="/reservation/ajouter" className="text-decoration-none">
                Ajouter
              </NavLink>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data.n_reservation}>
              <td>{data.n_reservation}</td>
              <td>{data.n_avion}</td>
              <td>{data.n_place}</td>
              <td>{(new Date(data.date_reservation)).toLocaleDateString()}</td>
              <td>{data.nom_voyageur}</td>
              <td>
                <NavLink
                  className="btn btn-primary mx-1"
                  to={"/reservation/modifier/" + data.n_reservation}
                >
                  Modifier
                </NavLink>
                <button
                  className="btn btn-danger mx-1"
                  onClick={() => {
                    axios.get(
                      "http://localhost:3001/reservation/supprimer/" + data.n_reservation
                    );
                    axios.get("http://localhost:3001/reservation").then((res) => {
                      setData(res.data);
                    });
                  }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Reservation;
