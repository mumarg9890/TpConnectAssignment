const jwt = require('jsonwebtoken');


module.exports=((req,res,next)=>{

    try {
        let token=req.headers.authorization.split(" ")[1];
       // console.log(token);
        const decodedToken =jwt.verify(token,process.env.jwt_key);
        req.userData=decodedToken;
        next(); 
    } catch (error) {
        return res.status(401).json({
            Message:'auth failed'
        });
    }
});