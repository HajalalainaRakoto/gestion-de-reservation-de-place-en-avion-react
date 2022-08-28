import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../autres/Navigation";

const FormAvion = () => {
  const navigate = useNavigate();
  const [allIdVol, setAllIdVol] = useState([]);
  const [data, setData] = useState({
    n_vol: "",
    nb_places: "",
    design: "",
  });
  const { id } = useParams();

  useEffect(() => {
    axios.get("http://localhost:3001/vol/allId/").then((res) => {
      setAllIdVol(res.data);
    });
    if (id != null) {
      axios.get("http://localhost:3001/avion/value/" + id).then((res) => {
        setData({
          n_vol: res.data[0].n_vol,
          nb_places: res.data[0].nb_places,
          design: res.data[0].design,
        });
      });
    }
  }, []);

  function onChangeNVol(e) {
    setData({
      n_vol: e.target.value,
      nb_places: data.nb_places,
      design: data.design,
    });
  }
  function onChangeNbPlaces(e) {
    setData({
      n_vol: data.n_vol,
      nb_places: e.target.value,
      design: data.design,
    });
  }
  function onChangeDesign(e) {
    setData({
      n_vol: data.n_vol,
      nb_places: data.nb_places,
      design: e.target.value,
    });
  }
  function onSubmitFormAvion(e) {
    e.preventDefault();
    if (id != null) {
      axios.post("http://localhost:3001/avion/modifier/" + id, data);
      navigate("/avion");
    } else {
      axios.post("http://localhost:3001/avion/ajouter", data);
      setData({
        n_vol: "",
        nb_places: "",
        design: "",
      });
    }
  }

  return (
    <>
      <Navigation />
      <div className="card col-8 mx-auto">
        <div className="card-header text-center">
          <h4>{id == null ? "Ajout" : "Modifier"} avion</h4>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmitFormAvion}>
            <label htmlFor="NVol">Numéro de vol : </label>
            <select id="NVol" value={data.n_vol} onChange={onChangeNVol} className="form-select form-select-sm">
              <option value=""></option>
              {allIdVol.map((data) => (
                <option key={data.n_vol} value={data.n_vol}>
                  {data.n_vol}
                </option>
              ))}
            </select>
            <label htmlFor="NbPlaces">Nombre de places : </label>
            <input
              id="NbPlaces"
              value={data.nb_places}
              onChange={onChangeNbPlaces}
              type="number"
              className="form-control form-control-sm mb-2"
            />
            <label htmlFor="Design">Design : </label>
            <input
              id="Design"
              value={data.design}
              onChange={onChangeDesign}
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

export default FormAvion;
