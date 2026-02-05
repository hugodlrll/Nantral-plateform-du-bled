const express = require('express'); // Moteur du serveur
const cors = require("cors"); // Permet la communication avec le front
const multer = require('multer'); // Gestion des uploads de fichiers
require('dotenv').config()

const app = express(); // Création du serveur web
app.use(express.json()); // Si on reçoit un json -> permet le parsing
app.use(cors()); // Autorise le front à communiquer

// Multer configuration pour les avatars
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

const {login, signup, me, updateAvatar, getAvatar, updateUsername, updateEmail, updatePassword}=require("./auth/authController");
const { requireAuth } = require('./auth/authMiddleware');
const { createEvent, getAllEvents, getUserEvents, deleteEvent, updateEvent, registerForEvent, unregisterFromEvent, getEventRegistrants } = require('./events/eventController');

// Routes Auth
app.post("/api/login", login)
app.get("/api/me", requireAuth, me)
app.post("/api/signup", signup)
app.post("/api/avatar", requireAuth, upload.single('avatar'), updateAvatar)
app.get("/api/avatar/:userId", getAvatar)
app.put("/api/username", requireAuth, updateUsername)
app.put("/api/email", requireAuth, updateEmail)
app.put("/api/password", requireAuth, updatePassword)

// Routes Events
app.post("/api/events", requireAuth, createEvent) // Créer un événement
app.get("/api/events", requireAuth, getAllEvents) // Récupérer tous les événements (auth pour statut d'inscription)
app.get("/api/events/my-events", requireAuth, getUserEvents) // Récupérer ses propres événements
app.post("/api/events/:eventId/register", requireAuth, registerForEvent) // S'inscrire à un événement
app.delete("/api/events/:eventId/register", requireAuth, unregisterFromEvent) // Se désinscrire d'un événement
app.get("/api/events/:eventId/registrants", requireAuth, getEventRegistrants) // Liste des inscrits d'un événement
app.put("/api/events/:eventId", requireAuth, updateEvent) // Modifier un événement
app.delete("/api/events/:eventId", requireAuth, deleteEvent) // Supprimer un événement

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});

