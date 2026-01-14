const JWT_SECRET = "supersecretkey";

exports.requireAuth=(req, res, next)=>{
    // Lire l'autorisation
    const authHeader = req.header("Authorization");

    // Si pas de token
    if(!authHeader){
        return res.status(401).json({error:"No token provided"});
    }

    // Récupère le token sans le "Bearer"
    const toker = authHeader.replace("Bearer", "");

    try{
        const decoded = JWT_SECRET.verify(token, JWT_SECRET);
        req.user=decoded;
        next();
        return res.json({user: {id: decoded.id, username: decode.username}})
    }
    catch{
        return res.status(401).json({error:"Token invalid"});
    }
}