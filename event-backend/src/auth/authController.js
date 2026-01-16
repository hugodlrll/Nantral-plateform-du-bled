const pool = require("../../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

exports.login = async(req, res)=>{
    const {username, password} = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);

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

    const token = jwt.sign({id:user.id, username:user.username}, JWT_SECRET, {expiresIn:"1h"});

    return res.json({token});
}

exports.signup = async(req, res) => {
    const {username, password} = req.body;

    const result = await pool.query("SELECT id FROM users WHERE username=$1", [username]);
    const existingUser = result.rows[0];

    if(existingUser){
        return res.status(409).json({error:"Username already taken"})
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const insertResult = await pool.query("INSERT INTO users(username, password) VALUES($1, $2) RETURNING id", [username, passwordHash]);
    const newUser = insertResult.rows[0];
    
    const token = jwt.sign({id: newUser.id, username: username}, JWT_SECRET, {expiresIn:"1h"});
    return res.json({token});

}

exports.me = async (req, res) => {
    return res.json({
        user:{
            id: req.user.id,
            username : req.user.username,
        },
    });
};