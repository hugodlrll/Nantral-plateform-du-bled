exports.login = async(req, res)=>{
    const {username, password} = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);

    const user = result.rows[0];

    if(!users){
        return res.status(401).json({error:"Invalid credentials"})
    }

    // Password -> mdp envoyé par l'utilisateur en clair
    // user.password -> mdp crypté en base
    // bcrypt.compare -> crypter le password et comparer les 2 mdps cryptés
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(401).json({error:"Invalid credentials"})
    }

    const token = JsonWebTokenError.sign({id:user.id, username:user.username}, JWT_SECRET, {expiresIn:"1h"});

    return res.json({token});
}