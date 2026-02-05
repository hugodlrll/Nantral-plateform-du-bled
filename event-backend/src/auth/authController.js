const pool = require("../../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async(req, res)=>{
    const {identifier, password} = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username=$1 OR email=$1", [identifier]);

    const user = result.rows[0];

    if(!user){
        return res.status(401).json({error:"Invalid credentials"})
    }

    // Password -> mdp envoyé par l'utilisateur en clair
    // user.password -> mdp crypté en base
    // bcrypt.compare -> crypter le password et comparer les 2 mdps cryptés
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(401).json({error:"Invalid credentials"})
    }

    const token = jwt.sign({id:user.id, username:user.username}, process.env.JWT_SECRET, {expiresIn:"1h"});

    return res.json({token});
}

exports.signup = async(req, res) => {
    try {
        const {username, email, password} = req.body;

        const result = await pool.query("SELECT id FROM users WHERE username=$1 OR email=$2", [username, email]);
        const existingUser = result.rows[0];

        if(existingUser){
            return res.status(409).json({error:"Username or email already taken"})
        }
        
        const passwordHash = await bcrypt.hash(password, 10);
        const insertResult = await pool.query("INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id", [username, email, passwordHash]);
        const newUser = insertResult.rows[0];
        
        const token = jwt.sign({id: newUser.id, username: username}, process.env.JWT_SECRET, {expiresIn:"1h"});
        return res.json({token});
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({error: "Internal server error"});
    }
}

exports.me = async (req, res) => {
    const result = await pool.query("SELECT id, username, email, avatar FROM users WHERE id=$1", [req.user.id]);
    const user = result.rows[0];
    
    return res.json({
        user:{
            id: user.id,
            username : user.username,
            email: user.email,
            hasAvatar: user.avatar !== null,
        },
    });
};

exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: "No file provided"});
        }

        const result = await pool.query(
            "UPDATE users SET avatar=$1 WHERE id=$2",
            [req.file.buffer, req.user.id]
        );

        return res.json({message: "Avatar updated successfully"});
    } catch (error) {
        console.error("Avatar upload error:", error);
        return res.status(500).json({error: "Failed to upload avatar"});
    }
};

exports.getAvatar = async (req, res) => {
    try {
        const {userId} = req.params;
        
        const result = await pool.query("SELECT avatar FROM users WHERE id=$1", [userId]);
        const user = result.rows[0];

        if (!user || !user.avatar) {
            return res.status(404).json({error: "Avatar not found"});
        }

        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(user.avatar);
    } catch (error) {
        console.error("Get avatar error:", error);
        return res.status(500).json({error: "Failed to retrieve avatar"});
    }
};

exports.updateUsername = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.trim().length === 0) {
            return res.status(400).json({error: "Username cannot be empty"});
        }

        const existingUser = await pool.query("SELECT id FROM users WHERE username=$1 AND id!=$2", [username, req.user.id]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({error: "Username already taken"});
        }

        const result = await pool.query("UPDATE users SET username=$1 WHERE id=$2 RETURNING id, username, email, avatar", [username, req.user.id]);
        const user = result.rows[0];

        return res.json({
            message: "Username updated successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                hasAvatar: user.avatar !== null,
            }
        });
    } catch (error) {
        console.error("Update username error:", error);
        return res.status(500).json({error: "Failed to update username"});
    }
};

exports.updateEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || email.trim().length === 0) {
            return res.status(400).json({error: "Email cannot be empty"});
        }

        const existingUser = await pool.query("SELECT id FROM users WHERE email=$1 AND id!=$2", [email, req.user.id]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({error: "Email already in use"});
        }

        const result = await pool.query("UPDATE users SET email=$1 WHERE id=$2 RETURNING id, username, email, avatar", [email, req.user.id]);
        const user = result.rows[0];

        return res.json({
            message: "Email updated successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                hasAvatar: user.avatar !== null,
            }
        });
    } catch (error) {
        console.error("Update email error:", error);
        return res.status(500).json({error: "Failed to update email"});
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({error: "Both passwords are required"});
        }

        if (newPassword.length < 6) {
            return res.status(400).json({error: "New password must be at least 6 characters"});
        }

        const result = await pool.query("SELECT password FROM users WHERE id=$1", [req.user.id]);
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({error: "Current password is incorrect"});
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password=$1 WHERE id=$2", [passwordHash, req.user.id]);

        return res.json({message: "Password updated successfully"});
    } catch (error) {
        console.error("Update password error:", error);
        return res.status(500).json({error: "Failed to update password"});
    }
};