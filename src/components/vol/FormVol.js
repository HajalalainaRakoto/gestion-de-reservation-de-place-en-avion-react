import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../autres/Navigation";

const FormVol = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    ville_depart: "",
    ville_arrivee: "",
    frais: "",
  });
  const { id } = useParams();

  useEffect(() => {
    if (id != null) {
      axios.get("http://localhost:3001/vol/value/" + id).then((res) => {
        setData({
          ville_depart: res.data[0].ville_depart,
          ville_arrivee: res.data[0].ville_arrivee,
          frais: res.data[0].frais,
        });
      });
    }
  }, []);

  function onChangeVilleDepart(e) {
    setData({
      ville_depart: e.target.value,
      ville_arrivee: data.ville_arrivee,
      frais: data.frais,
    });
  }
  function onChangeVilleArrivee(e) {
    setData({
      ville_depart: data.ville_depart,
      ville_arrivee: e.target.value,
      frais: data.frais,
    });
  }
  function onChangeFrais(e) {
    setData({
      ville_depart: data.ville_depart,
      ville_arrivee: data.ville_arrivee,
      frais: e.target.value,
    });
  }
  function onSubmitFormVol(e) {
    e.preventDefault();
    if (id != null) {
      axios.post("http://localhost:3001/vol/modifier/" + id, data);
      navigate("/vol");
    } else {
      axios.post("http://localhost:3001/vol/ajouter", data);
      setData({
        ville_depart: "",
        ville_arrivee: "",
        frais: "",
      });
    }
  }

  return (
    <>
      <Navigation />
      <div className="card col-8 mx-auto">
        <div className="card-header text-center">
          <h4>{id == null ? "Ajout" : "Modifier"} vol</h4>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmitFormVol}>
            <label htmlFor="VilleDepart">Ville de départ : </label>
            <input
              id="VilleDepart"
              value={data.ville_depart}
              onChange={onChangeVilleDepart}
              type="text"
              className="form-control form-control-sm mb-2"
            />
            <label htmlFor="VilleArrivee">Ville d'arrivée : </label>
            <input
              id="VilleArrivee"
              value={data.ville_arrivee}
              onChange={onChangeVilleArrivee}
              type="text"
              className="form-control form-control-sm mb-2"
            />
            <label htmlFor="Frais">Frais : </label>
            <input
              id="Frais"
              value={data.frais}
              onChange={onChangeFrais}
              type="number"
              className="form-control form-control-sm mb-2"
            />
            <input className="btn btn-success" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default FormVol;
