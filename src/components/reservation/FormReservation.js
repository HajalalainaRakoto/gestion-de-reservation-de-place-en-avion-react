import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../autres/Navigation";

const FormReservation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [allIdAvion, setAllIdAvion] = useState([]);
  const [allIdPlace, setAllIdPlace] = useState([]);
  const [data, setData] = useState({
    n_avion: "",
    n_place: "",
    date_reservation: new Date().toLocaleDateString("en-CA"),
    nom_voyageur: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3001/avion/allId/").then((res) => {
      setAllIdAvion(res.data);
    });

    if (id != null) {
      axios.get("http://localhost:3001/place/allId/").then((res) => {
        setAllIdPlace(res.data);
      });
      axios.get("http://localhost:3001/reservation/value/" + id).then((res) => {
        setData({
          n_avion: res.data[0].n_avion,
          n_place: res.data[0].n_place,
          date_reservation: new Date(
            res.data[0].date_reservation
          ).toLocaleDateString("en-CA"),
          nom_voyageur: res.data[0].nom_voyageur,
        });
      });
    } else {
      axios.get("http://localhost:3001/place/allIdFalse/").then((res) => {
        setAllIdPlace(res.data);
      });
    }
  }, []);

  function onChangeNAvion(e) {
    axios.get("http://localhost:3001/place/id/"+e.target.value).then((res) => {
      setAllIdPlace(res.data);
    });
    setData({
      n_avion: e.target.value,
      n_place: data.n_place,
      date_reservation: data.date_reservation,
      nom_voyageur: data.nom_voyageur,
    });
  }
  function onChangeNPlace(e) {
    setData({
      n_avion: data.n_avion,
      n_place: e.target.value,
      date_reservation: data.date_reservation,
      nom_voyageur: data.nom_voyageur,
    });
  }
  function onChangeDateReservation(e) {
    setData({
      n_avion: data.n_avion,
      n_place: data.n_place,
      date_reservation: new Date(e.target.value).toLocaleDateString("en-CA"),
      nom_voyageur: data.nom_voyageur,
    });
  }
  function onChangeNomVoyageur(e) {
    setData({
      n_avion: data.n_avion,
      n_place: data.n_place,
      date_reservation: data.date_reservation,
      nom_voyageur: e.target.value,
    });
  }
  function onSubmitFormReservation(e) {
    e.preventDefault();
    if (id != null) {
      axios.post("http://localhost:3001/reservation/modifier/" + id, data);
      navigate("/reservation");
    } else {
      axios.post("http://localhost:3001/reservation/ajouter", data);
      setData({
        n_avion: "",
        n_place: "",
        date_reservation: new Date().toLocaleDateString("en-CA"),
        nom_voyageur: "",
      });
    }
  }
  return (
    <>
      <Navigation />
      <div className="card col-8 mx-auto">
        <div className="card-header text-center">
          <h4>{id == null ? "Ajout" : "Modifier"} réservation</h4>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmitFormReservation}>
            <label htmlFor="NAvion">Numéro avion : </label>
            <select
              id="NAvion"
              value={data.n_avion}
              onChange={onChangeNAvion}
              className="form-select form-select-sm"
            >
              <option value=""></option>
              {allIdAvion.map((data) => (
                <option key={data.n_avion} value={data.n_avion}>
                  {data.n_avion}
                </option>
              ))}
            </select>
            <label htmlFor="NPlace">Numéro place : </label>
            <select
              id="NPlace"
              value={data.n_place}
              onChange={onChangeNPlace}
              className="form-select form-select-sm"
            >
              <option value=""></option>
              {allIdPlace.map((data) => (
                <option key={data.n_place} value={data.n_place}>
                  {data.n_place}
                </option>
              ))}
            </select>
            <label htmlFor="DateReservation">Date de réservation : </label>
            <input
              id="DateReservation"
              value={data.date_reservation}
              onChange={onChangeDateReservation}
              type="date"
              className="form-control form-control-sm mb-2"
            />
            <label htmlFor="NomVoyageur">Nom du voyageur : </label>
            <input
              id="NomVoyageur"
              value={data.nom_voyageur}
              onChange={onChangeNomVoyageur}
              type="text"
              className="form-control form-control-sm mb-2"
            />
            <input className="btn btn-success" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default FormReservation;
