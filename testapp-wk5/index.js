//import required modules
const express = require("express");
//const functions = require("firebase-functions");
const path = require("path");
const dotenv = require("dotenv");
let ptA = "";
let ptB = "";

dotenv.config();
const trakt = require("./modules/trakt/api");
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
//mongodb stuff
const { MongoClient } = require("mongodb");
//const dbUrl = "mongodb://127.0.0.1:27017/howdb"; //default port is 27017
//const dbUrl = 'mongodb+srv://subhisamp:5vXJxhR2aXQbSC2L@cluster0.no8s8wy.mongodb.net/?retryWrites=true&w=majority';
const dbUrl = process.env.DB_URL;
const client = new MongoClient(dbUrl);
var ObjectId = require('mongodb').ObjectId;

//set up Express app
const app = express();
const port = process.env.PORT || 8888;

//define important folders
/*app.set("views", path.join(__dirname, "views"));*/
path.join(__dirname, 'functions/views')
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(upload.array()); 
app.use(express.static('public'));

app.get("/route", async (request, response) => {
  let drivers = await getDrivers();
    response.render("route", { title: "Rides", menu: drivers, fp: ptA, to: ptB });
 });

 app.get("/searchRide", async (request, response) => {
  let rides = await getRides();
    response.render("rides", { title: "Rides", menu: rides, fp: ptA, to: ptB });
 });
app.get("/routeInfo", async (request, response) => {
    let movies = await trakt.getRoutePoints(ptA,ptB);
    let timeMin = (parseInt(movies.route.time,10)/60).toFixed(2);
 response.render("routeinfo", { title: "Movies", movieList: movies, pA: ptA, pB:ptB, rideTime: timeMin});
  //console.log(movies);
 // response.render("routeinfo", { title: "Movies", movieList: movies, pA: ptA, pB:ptB, drvList: driverList, dist:drvDist });
});

app.get("/", (request, response) => {
  response.render("openPage");
});
app.get("/addRideSuccess", (request, response) => {
  response.render("addedRide");
});

app.get("/addDriver", (request, response) => {
  response.render("addDriver");
});

app.get("/yourProfile", (request, response) => {
  response.render("addyourProfile");
});

app.get("/about", (request, response) => {
  response.render("about");
});

app.get("/contact", (request, response) => {
  response.render("contact");
});
app.get("/postRide", (request, response) => {
  response.render("getridedet");
});
app.get("/aboutRide", async (request, response) => {
  let id = request.query.rideId;  
  let selRide = await getRideDet(id);
  ptA= selRide.from;
  ptB = selRide.to;
response.redirect("/routeInfo");
  
});

app.get("/deleteRide", async (request, response) => {
  let id = request.query.rideId;  
  await delRide(id);
  
response.redirect("/");

});

app.post("/postRide/submit", async (request, response) => {
  let rideID = request.body.rideID;
  let from = request.body.from;
  let to = request.body.to;
  let drvID = request.body.drvID;
  let usID = request.body.usID;
  let distance = request.body.distance;
  let cost = request.body.cost;
  var newRide = {"rideID": rideID, "from": from, "to": to, "driverID": drvID, "userID": usID, "distance": distance, "cost": cost};
  await addRide(newRide);
  response.redirect("/addRideSuccess"); 
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

async function connection() {
  await client.connect();
  db = client.db("howdb");
  return db;
  }
  async function getDrivers() {
  db = await connection();
  var results = db.collection("driverData").find({});
  res = await results.toArray();
  return res;
  }
  async function addRide(ride) {
    db = await connection();
    var status = await db.collection("rideData").insertOne(ride);
    console.log("ride added");
    }
  async function getRides() {
      db = await connection();
      var results = db.collection("rideData").find({});
      res = await results.toArray();
      return res;
      }
  async function getRideDet(id) {
    
        db = await connection();
        //const getRideId = { _id: new ObjectId(id) };
       //const getRideId = { _id: new MongoId(id) };
        //getRideId = "ObjectId(" + "\"" + id + "\"" +")"
       
      const query  = {"_id": new ObjectId(id)}
        const result = await db.collection("rideData").findOne(query);
        return result;
        }

        async function delRide(id) {
    
          db = await connection();
          //const getRideId = { _id: new ObjectId(id) };
         //const getRideId = { _id: new MongoId(id) };
          //getRideId = "ObjectId(" + "\"" + id + "\"" +")"
         
        const query  = {"_id": new ObjectId(id)}
        const result = await db.collection("rideData").deleteOne(query); 
        if (result.deletedCount == 1) 
        console.log("delete successful");
        }



