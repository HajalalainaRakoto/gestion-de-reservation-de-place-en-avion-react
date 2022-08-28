import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../autres/Navigation";

const Avion = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/avion").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <>
      <Navigation />
      <table className="table table-striped table-borderless text-center">
        <thead>
          <tr>
            <th>Numéro avion</th>
            <th>Numéro vol</th>
            <th>Nombre de place</th>
            <th>Design</th>
            <th>
              <NavLink to="/avion/ajouter" className="text-decoration-none">
                Ajouter
              </NavLink>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data.n_avion}>
              <td>{data.n_avion}</td>
              <td>{data.n_vol}</td>
              <td>{data.nb_places}</td>
              <td>{data.design}</td>
              <td>
                <NavLink
                  className="btn btn-info mx-1"
                  to={"/avion/visualiser/" + data.n_avion}
                >
                  Visualiser
                </NavLink>
                <NavLink
                  className="btn btn-primary mx-1"
                  to={"/avion/modifier/" + data.n_avion}
                >
                  Modifier
                </NavLink>
                <button
                  className="btn btn-danger mx-1"
                  onClick={() => {
                    axios.get(
                      "http://localhost:3001/avion/supprimer/" + data.n_avion
                    );
                    axios.get("http://localhost:3001/avion").then((res) => {
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

export default Avion;
