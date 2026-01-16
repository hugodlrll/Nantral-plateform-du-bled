const express = require('express'); // Moteur du serveur
const cors = require("cors"); // Permet la communication avec le front

const app = express(); // Création du serveur web
app.use(express.json()); // Si on reçoit un json -> permet le parsing
app.use(cors()); // Autorise le front à communiquer

const {login, signup, me}=require("./auth/authController");
const { requireAuth } = require('./auth/authMiddleware');

// Routes
app.post("/api/login", login)
app.post("/api/me", requireAuth, me)
app.post("/api/signup", signup)

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});

