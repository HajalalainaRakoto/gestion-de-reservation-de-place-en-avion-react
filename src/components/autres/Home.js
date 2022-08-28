import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import Navigation from "./Navigation";

const Home = () => {
  const color = ["green", "blue", "red", "white", "dark", "purple", "yellow"];
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [annee, setAnnee] = useState("");
  const state = {
    labels: labels,
    datasets: [
      {
        backgroundColor: color,
        data: data,
      },
    ],
  };
  function onChangeAnnee(e) {
    if (e.target.value !== "") {
      setAnnee(e.target.value);
      axios
        .get("http://localhost:3001/recette/nAvion/" + e.target.value)
        .then((res) => {
          var tab = [];
          for (let index = 0; index < res.data.length; index++) {
            tab.push("Avion n°"+res.data[index].n_avion);
          }
          setLabels(tab);
        });
      axios
        .get("http://localhost:3001/recette/sommeFrais/" + e.target.value)
        .then((res) => {
          var tab = [];
          for (let index = 0; index < res.data.length; index++) {
            tab.push(res.data[index].somme_frais);
          }
          setData(tab);
        });
    }
  }
  const [allAnnee, setAllAnnee] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/reservation/allAnnee/")
      .then((res) => setAllAnnee(res.data));
  });

  function cardRecette() {
    return (
      <div className="card col-3 mx-auto mt-4">
        <div className="card-header text-center">
          <h4>Recette {annee}</h4>
        </div>
        <div className="card-body">
          <Pie data={state} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="col-5 row mx-auto">
        <label htmlFor="AllAnnee" className="col-3">
          Année :{" "}
        </label>
        <select
          id="AllAnnee"
          onChange={onChangeAnnee}
          className="form-select form-select-sm col"
        >
          <option value=""></option>
          {allAnnee.map((data) => (
            <option key={data.annee} value={data.annee}>
              {data.annee}
            </option>
          ))}
        </select>
      </div>
      {labels.length !== 0 ? cardRecette() : ""}
    </>
  );
};

export default Home;
