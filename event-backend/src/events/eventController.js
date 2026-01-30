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

// Récupérer tous les événements avec statut d'inscription de l'utilisateur
exports.getAllEvents = async (req, res) => {
    try {
        const user_id = req.user ? req.user.id : null;
        
        const query = `
            SELECT 
                e.id, 
                e.title, 
                e.date, 
                e.description, 
                e.created_by, 
                u.username as created_by_username, 
                e.created_at,
                COUNT(DISTINCT ue.user_id) as registrants_count,
                CASE WHEN $1::int IS NOT NULL THEN 
                    EXISTS(SELECT 1 FROM user_events WHERE event_id = e.id AND user_id = $1)
                ELSE false END as is_registered,
                CASE WHEN $1::int IS NOT NULL THEN
                    e.created_by = $1
                ELSE false END as is_owner
            FROM events e
            JOIN users u ON e.created_by = u.id
            LEFT JOIN user_events ue ON e.id = ue.event_id
            GROUP BY e.id, u.username
            ORDER BY e.created_at DESC;
        `;

        const result = await pool.query(query, [user_id]);
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
            SELECT 
                e.id, 
                e.title, 
                e.date, 
                e.description, 
                e.created_by, 
                e.created_at,
                COUNT(DISTINCT ue.user_id) as registrants_count,
                true as is_owner
            FROM events e
            LEFT JOIN user_events ue ON e.id = ue.event_id
            WHERE e.created_by = $1
            GROUP BY e.id
            ORDER BY e.created_at DESC;
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

// S'inscrire à un événement
exports.registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const user_id = req.user.id;

        const query = `
            INSERT INTO user_events (event_id, user_id, created_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (event_id, user_id) DO NOTHING
            RETURNING id;
        `;

        const result = await pool.query(query, [eventId, user_id]);

        if (result.rows.length === 0) {
            return res.status(409).json({ message: "Vous êtes déjà inscrit à cet événement" });
        }

        res.status(200).json({ message: "Inscription réussie" });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Se désinscrire d'un événement
exports.unregisterFromEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const user_id = req.user.id;

        const query = `
            DELETE FROM user_events
            WHERE event_id = $1 AND user_id = $2
            RETURNING id;
        `;

        const result = await pool.query(query, [eventId, user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Vous n'êtes pas inscrit à cet événement" });
        }

        res.status(200).json({ message: "Désinscription réussie" });
    } catch (error) {
        console.error("Erreur lors de la désinscription :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer la liste des inscrits à un événement
exports.getEventRegistrants = async (req, res) => {
    try {
        const { eventId } = req.params;

        const query = `
            SELECT u.id, u.username
            FROM user_events ue
            JOIN users u ON ue.user_id = u.id
            WHERE ue.event_id = $1
            ORDER BY ue.created_at ASC;
        `;

        const result = await pool.query(query, [eventId]);
        res.status(200).json({ registrants: result.rows });
    } catch (error) {
        console.error("Erreur lors de la récupération des inscrits :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
