const express = require('express'); // Moteur du serveur
const cors = require("cors"); // Permet la communication avec le front
require('dotenv').config()

const app = express(); // Création du serveur web
app.use(express.json()); // Si on reçoit un json -> permet le parsing
app.use(cors()); // Autorise le front à communiquer

const {login, signup, me}=require("./auth/authController");
const { requireAuth } = require('./auth/authMiddleware');
const { createEvent, getAllEvents, getUserEvents, deleteEvent } = require('./events/eventController');

// Routes Auth
app.post("/api/login", login)
app.get("/api/me", requireAuth, me)
app.post("/api/signup", signup)

// Routes Events
app.post("/api/events", requireAuth, createEvent) // Créer un événement
app.get("/api/events", getAllEvents) // Récupérer tous les événements
app.get("/api/events/my-events", requireAuth, getUserEvents) // Récupérer ses propres événements
app.delete("/api/events/:eventId", requireAuth, deleteEvent) // Supprimer un événement

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});

