import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../autres/Navigation";

const Vol = () => {
  // const isInitialMount = useRef(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/vol").then((res) => {
      setData(res.data);
    });
  }, []);

  // function supprimer(id) {
  //   useEffect(() => {
  //     if (isInitialMount.current) {
  //       isInitialMount.current = false;
  //     } else {
  //       axios.delete("http://localhost:3001/vol/supprimer/" + id);
  //     }
  //   }, []);
  // }

  return (
    <>
      <Navigation />
      <table className="table table-striped table-borderless text-center">
        <thead>
          <tr>
            <th>Numéro vol</th>
            <th>Ville de départ</th>
            <th>Ville d'arrivée</th>
            <th>Frais</th>
            <th>
              <NavLink to="/vol/ajouter" className="text-decoration-none">Ajouter</NavLink>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data.n_vol}>
              <td>{data.n_vol}</td>
              <td>{data.ville_depart}</td>
              <td>{data.ville_arrivee}</td>
              <td>{data.frais}</td>
              <td>
                <NavLink
                  className="btn btn-primary mx-1"
                  to={"/vol/modifier/" + data.n_vol}
                >
                  Modifier
                </NavLink>
                <button
                  className="btn btn-danger mx-1"
                  onClick={() => {
                    axios.get(
                      "http://localhost:3001/vol/supprimer/" + data.n_vol
                    );
                    axios.get("http://localhost:3001/vol").then((res) => {
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

export default Vol;
