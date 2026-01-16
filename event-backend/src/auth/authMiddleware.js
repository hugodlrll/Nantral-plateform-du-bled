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
        const decoded = process.env.JWT_SECRET.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch{
        return res.status(401).json({error:"Token invalid"});
    }
}