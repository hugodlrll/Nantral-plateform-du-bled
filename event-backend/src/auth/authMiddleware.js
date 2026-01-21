const jwt = require("jsonwebtoken");

exports.requireAuth=(req, res, next)=>{
    // Lire l'autorisation
    const authHeader = req.header("Authorization");

    // Si pas de token
    if(!authHeader){
        return res.status(401).json({error:"No token provided"});
    }

    // Récupère le token sans le "Bearer"
    const token = authHeader.replace("Bearer", "").trim();

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch{
        return res.status(401).json({error:"Token invalid"});
    }
}