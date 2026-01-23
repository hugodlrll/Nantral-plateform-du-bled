const pool = require("../../db");

// Créer un événement
exports.createEvent = async (req, res) => {
    try {
        const { title, date, description } = req.body;
        const user_id = req.user.id; // L'utilisateur vient du middleware d'authentification

        if (!title || !date || !description) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const query = `
            INSERT INTO events (title, date, description, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            RETURNING id, title, date, description, created_by, created_at;
        `;

        const result = await pool.query(query, [title, date, description, user_id]);
        res.status(201).json({
            message: "Événement créé avec succès",
            event: result.rows[0]
        });
    } catch (error) {
        console.error("Erreur lors de la création de l'événement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer tous les événements
exports.getAllEvents = async (req, res) => {
    try {
        const query = `
            SELECT e.id, e.title, e.date, e.description, e.created_by, u.username as created_by_username, e.created_at
            FROM events e
            JOIN users u ON e.created_by = u.id
            ORDER BY e.created_at DESC;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les événements de l'utilisateur connecté
exports.getUserEvents = async (req, res) => {
    try {
        const user_id = req.user.id;

        const query = `
            SELECT id, title, date, description, created_by, created_at
            FROM events
            WHERE created_by = $1
            ORDER BY created_at DESC;
        `;

        const result = await pool.query(query, [user_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const user_id = req.user.id;

        const query = `
            DELETE FROM events
            WHERE id = $1 AND created_by = $2
            RETURNING id;
        `;

        const result = await pool.query(query, [eventId, user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Événement non trouvé ou vous n'avez pas la permission de le supprimer" });
        }

        res.status(200).json({ message: "Événement supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Mettre à jour un événement
exports.updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, date, description } = req.body;
        const user_id = req.user.id;

        if (!title || !date || !description) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const query = `
            UPDATE events
            SET title = $1, date = $2, description = $3, updated_at = NOW()
            WHERE id = $4 AND created_by = $5
            RETURNING id, title, date, description, created_by, created_at, updated_at;
        `;

        const result = await pool.query(query, [title, date, description, eventId, user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Événement non trouvé ou vous n'avez pas la permission de le modifier" });
        }

        res.status(200).json({
            message: "Événement modifié avec succès",
            event: result.rows[0]
        });
    } catch (error) {
        console.error("Erreur lors de la modification de l'événement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
