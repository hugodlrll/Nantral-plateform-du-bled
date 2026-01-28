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
    const result = await pool.query("SELECT id, username, email FROM users WHERE id=$1", [req.user.id]);
    const user = result.rows[0];
    
    return res.json({
        user:{
            id: user.id,
            username : user.username,
            email: user.email,
        },
    });
};