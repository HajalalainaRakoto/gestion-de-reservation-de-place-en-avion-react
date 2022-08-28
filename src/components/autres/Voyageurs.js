import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";

const Voyageurs = () => {
  const { id } = useParams();
  const [placeOccupees, setPlaceOccupees] = useState(0);
  const [placeDisponibles, setPlaceDisponibles] = useState(0);
  const [listeVoyageurs, setListeVoyageurs] = useState([]);
  const [recetteBilan, setRecetteBilan] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/place/occupees/" + id)
      .then((res) => setPlaceOccupees(res.data[0].nb_place_occupees));
    axios
      .get("http://localhost:3001/place/disponibles/" + id)
      .then((res) => setPlaceDisponibles(res.data[0].nb_place_disponibles));
    axios
      .get("http://localhost:3001/voyageurs/" + id)
      .then((res) => setListeVoyageurs(res.data));
    axios
      .get("http://localhost:3001/recette/avion/" + id)
      .then((res) => setRecetteBilan(res.data));
  });
  return (
    <>
      <Navigation />
      <div className="card col-10 mx-auto">
        <div className="card-header text-center">
          <h4>Information sur l'avion numéro {id}</h4>
        </div>
        <div className="card-body">
          <table className="table table-striped table-borderless text-center">
            <thead>
              <tr>
                <th>Nom du voyageur</th>
                <th>Numéro de place</th>
                <th>Numéro de vol </th>
                <th>Date de réservation</th>
              </tr>
            </thead>
            <tbody>
              {listeVoyageurs.map((data) => (
                <tr key={data.n_place}>
                  <td>{data.nom_voyageur}</td>
                  <td>{data.n_place}</td>
                  <td>{data.n_vol}</td>
                  <td>
                    {new Date(data.date_reservation).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col">
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0">
                  Nombre de place disponibles : <strong>{placeDisponibles}</strong>
                </li>
                <li className="list-group-item">
                  Nombre de place occupées : <strong>{placeOccupees}</strong>
                </li>
              </ul>
            </div>
            <div className="col">
              {recetteBilan.map((data, index) => (
                <ul key={index} className="list-group list-group-flush">
                  <li className="list-group-item">
                    {data.annee_mois} : <strong>{data.somme_frais}</strong>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Voyageurs;
