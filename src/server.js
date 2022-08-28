const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers","X-Requested-With, content-type");
  next();
})

const connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "",
  database : "gestion_de_reservation_de_place_en_avion"
});

connection.connect(function (err) {
  if(err) throw err;
  console.log("Database connected");
});

function requeteAvecReponse(sql, res) {
  connection.query(sql, function (err, resultat) {
    if(err) throw err;
    res.send(resultat);
    res.end();
  })
}

function requeteSansReponse(sql) {
  connection.query(sql, function (err) {
    if(err) throw err;
  })
}

// les methodes pour autres

app.get("/voyageurs/:id", (req, res) => {
  const sql = "SELECT nom_voyageur, place.n_place, vol.n_vol, date_reservation FROM avion, vol, reservation, place WHERE avion.n_vol = vol.n_vol AND reservation.n_avion = avion.n_avion AND reservation.n_place = place.n_place AND avion.n_avion = "+req.params.id;
  requeteAvecReponse(sql, res);
});

app.get("/recette/avion/:id", (req, res) => {
  const sql = "SELECT DATE_FORMAT(date_reservation, '%M %Y') AS annee_mois, SUM(frais) AS somme_frais FROM avion, vol, reservation WHERE avion.n_vol = vol.n_vol AND reservation.n_avion = avion.n_avion AND avion.n_avion ="+ req.params.id+" GROUP BY annee_mois";
  requeteAvecReponse(sql, res);
});

app.get("/recette/nAvion/:annee", (req, res) => {
  const sql = "SELECT avion.n_avion FROM avion, vol, reservation WHERE avion.n_vol = vol.n_vol AND reservation.n_avion = avion.n_avion AND YEAR(date_reservation) = "+req.params.annee+" GROUP BY avion.n_avion";
  requeteAvecReponse(sql, res);
});

app.get("/recette/sommeFrais/:annee", (req, res) => {
  const sql = "SELECT SUM(frais) AS somme_frais FROM avion, vol, reservation WHERE avion.n_vol = vol.n_vol AND reservation.n_avion = avion.n_avion AND YEAR(date_reservation) = "+req.params.annee+" GROUP BY avion.n_avion";
  requeteAvecReponse(sql, res);
});

// les methodes pour place

app.get("/place/occupees/:id", (req, res) => {
  const sql = "SELECT COUNT(n_place) AS nb_place_occupees FROM place WHERE occupation = true AND n_avion = "+req.params.id;
  requeteAvecReponse(sql, res);
});

app.get("/place/disponibles/:id", (req, res) => {
  const sql = "SELECT COUNT(n_place) AS nb_place_disponibles FROM place WHERE occupation = false AND n_avion = "+req.params.id;
  requeteAvecReponse(sql, res);
});

app.get("/place/allIdFalse", (req, res) => {
  const sql = "SELECT n_place FROM place WHERE occupation = false";
  requeteAvecReponse(sql, res);
});

app.get("/place/allId", (req, res) => {
  const sql = "SELECT n_place FROM place";
  requeteAvecReponse(sql, res);
});

app.get("/place/id/:id", (req, res) => {
  const sql = "SELECT n_place FROM place WHERE occupation = false AND n_avion = "+req.params.id;
  requeteAvecReponse(sql, res);
});

// les methodes pour vol

app.get("/vol", (req, res) => {
  const sql = "SELECT * FROM vol";
  requeteAvecReponse(sql, res);
});

app.get("/vol/supprimer/:id", (req, res) => {
  const sql = "DELETE FROM vol WHERE n_vol = "+req.params.id;
  requeteSansReponse(sql);
  res.end();
});

app.post("/vol/ajouter", (req, res) => {
  const villeDepart = "'"+req.body.ville_depart +"', ";
  const villeArrivee = "'"+req.body.ville_arrivee+"', ";
  const frais = req.body.frais;
  const sql = "INSERT INTO vol (ville_depart, ville_arrivee, frais) VALUES ("+villeDepart+villeArrivee+frais+")";
  requeteSansReponse(sql);
  res.end();
});

app.post("/vol/modifier/:id", (req, res) => {
  const villeDepart = "'"+req.body.ville_depart +"', ";
  const villeArrivee = "'"+req.body.ville_arrivee+"', ";
  const frais = req.body.frais;
  const sql = "UPDATE vol SET ville_depart = "+villeDepart+"ville_arrivee = "+villeArrivee+"Frais = "+frais+" WHERE n_vol = "+req.params.id;
  requeteSansReponse(sql);
  res.end();
});

app.get("/vol/value/:id", (req, res) => {
  const sql = "SELECT * FROM vol WHERE n_vol = "+req.params.id;
  requeteAvecReponse(sql, res);
});

app.get("/vol/allId", (req, res) => {
  const sql = "SELECT n_vol FROM vol";
  requeteAvecReponse(sql, res);
});

// Les methodes pour avion

app.get("/avion", (req, res) => {
  const sql = "SELECT * FROM avion";
  requeteAvecReponse(sql, res);
});

app.get("/avion/supprimer/:id", (req, res) => {
  const sql = "DELETE FROM avion WHERE n_avion = "+req.params.id;
  requeteSansReponse(sql);
  const sql1 = "DELETE FROM place WHERE n_avion = "+req.params.id;
  requeteSansReponse(sql1);
  res.end();
});

app.post("/avion/ajouter", (req, res) => {
  const nVol = req.body.n_vol+", ";
  const nbPlaces = req.body.nb_places+", ";
  const design = "'"+req.body.design+"'";
  const sql = "INSERT INTO avion (n_vol, nb_places, design) VALUES ("+nVol+nbPlaces+design+")";
  connection.query(sql, function (err, resultat) {
    if(err) throw err;
    for (let i = 0; i < req.body.nb_places; i++) {
      const sql1 = "INSERT INTO place (n_avion, occupation) VALUES ("+resultat.insertId+", false)";
      requeteSansReponse(sql1);
    }
  })
  res.end();
});

app.post("/avion/modifier/:id", (req, res) => {
  const nVol = req.body.n_vol+", ";
  const nbPlaces = req.body.nb_places+", ";
  const design = "'"+req.body.design+"'";
  const sql = "UPDATE avion SET n_vol = "+nVol+"nb_places = "+nbPlaces+"design = "+design+" WHERE n_avion = "+req.params.id;
  requeteSansReponse(sql);
  const sql1 = "DELETE FROM place WHERE n_avion = "+req.params.id;
  requeteSansReponse(sql1);
  for (let i = 0; i < req.body.nb_places; i++) {
    const sql2 = "INSERT INTO place (n_avion, occupation) VALUES ("+req.params.id+", false)";
    requeteSansReponse(sql2);
  }
  res.end();
});

app.get("/avion/value/:id", (req, res) => {
  const sql = "SELECT * FROM avion WHERE n_avion = "+req.params.id;
  requeteAvecReponse(sql, res);
});

app.get("/avion/allId", (req, res) => {
  const sql = "SELECT n_avion FROM avion";
  requeteAvecReponse(sql, res);
});

// les méthodes pour réservation

app.get("/reservation", (req, res) => {
  const sql = "SELECT * FROM reservation";
  requeteAvecReponse(sql, res);
});

app.get("/reservation/supprimer/:id", (req, res) => {
  const sql = "SELECT n_place FROM reservation WHERE n_reservation = "+req.params.id;
  connection.query(sql, (err, resultat) => {
    if (err) throw err;
    const sql1 = "UPDATE place SET occupation = false WHERE n_place = "+resultat[0].n_place;
    requeteSansReponse(sql1);
  });
  const sql2 = "DELETE FROM reservation WHERE n_reservation = "+req.params.id;
  requeteSansReponse(sql2);
  res.end();
});

app.post("/reservation/ajouter", (req, res) => {
  const nAvion = req.body.n_avion+", ";
  const nPlace = req.body.n_place+", ";
  const dateReservation = "'"+req.body.date_reservation+"', ";
  const nomVoyageur = "'"+req.body.nom_voyageur+"'";
  const sql = "INSERT INTO reservation (n_avion, n_place, date_reservation, nom_voyageur) VALUES ("+nAvion+nPlace+dateReservation+nomVoyageur+")";
  requeteSansReponse(sql);
  const sql1 = "UPDATE place SET occupation = true WHERE n_place = "+req.body.n_place;
  requeteSansReponse(sql1);
  res.end();
});

app.post("/reservation/modifier/:id", (req, res) => {
  const nAvion = req.body.n_avion+", ";
  const nPlace = req.body.n_place+", ";
  const dateReservation = "'"+req.body.date_reservation+"', ";
  const nomVoyageur = "'"+req.body.nom_voyageur+"'";
  const sql = "SELECT n_place FROM reservation WHERE n_reservation = "+req.params.id;
  connection.query(sql, (err, resultat) => {
    if (err) throw err;
    if (resultat[0].n_place != req.body.n_place) {
      const sql1 = "UPDATE place SET occupation = false WHERE n_place = "+resultat[0].n_place;
      requeteSansReponse(sql1);
    }
  });
  const sql1 = "UPDATE reservation SET n_avion = "+nAvion+"n_place = "+nPlace+"date_reservation = "+dateReservation+"nom_voyageur = "+nomVoyageur+" WHERE n_reservation = "+req.params.id;
  requeteSansReponse(sql1);
  const sql2 = "UPDATE place SET occupation = true WHERE n_place = "+req.body.n_place;
  requeteSansReponse(sql2);
  res.end();
});

app.get("/reservation/value/:id", (req, res) => {
  const sql = "SELECT * FROM reservation WHERE n_reservation = "+req.params.id;
  requeteAvecReponse(sql, res);
});

app.get("/reservation/allAnnee", (req, res) => {
  const sql = "SELECT DISTINCT(YEAR(date_reservation)) AS annee FROM reservation";
  requeteAvecReponse(sql, res);
});

app.listen(3001, console.log("Server started on port 3001"));
