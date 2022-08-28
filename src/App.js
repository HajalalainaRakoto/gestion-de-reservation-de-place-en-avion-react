import "./App.css";
import React from "react";
import Vol from "./components/vol/Vol";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/autres/Home";
import FormVol from "./components/vol/FormVol";
import Avion from "./components/avion/Avion";
import FormAvion from "./components/avion/FormAvion";
import Reservation from "./components/reservation/Reservation";
import FormReservation from "./components/reservation/FormReservation";
import Voyageurs from "./components/autres/Voyageurs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* routes par défaut */}
        <Route path="/" element={<Home />}></Route>
        <Route path="*" element={<Home />}></Route>
        {/* routes vol */}
        <Route path="/vol" element={<Vol />}></Route>
        <Route path="/vol/supprimer/:id" element={<Vol />}></Route>
        <Route path="/vol/ajouter" element={<FormVol />}></Route>
        <Route path="/vol/modifier/:id" element={<FormVol />}></Route>
        {/* routes avion */}
        <Route path="/avion" element={<Avion />}></Route>
        <Route path="/avion/supprimer/:id" element={<Avion />}></Route>
        <Route path="/avion/ajouter" element={<FormAvion />}></Route>
        <Route path="/avion/modifier/:id" element={<FormAvion />}></Route>
        <Route path="/avion/visualiser/:id" element={<Voyageurs />}></Route>
        {/* routes réservation */}
        <Route path="/reservation" element={<Reservation />}></Route>
        <Route path="/reservation/supprimer/:id" element={<Reservation />}></Route>
        <Route path="/reservation/ajouter" element={<FormReservation />}></Route>
        <Route path="/reservation/modifier/:id" element={<FormReservation />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
