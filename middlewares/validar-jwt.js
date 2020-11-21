
const { response } = require("express");
const jwt = require("jsonwebtoken");


const validarJWT=(req, res = response, next)=>{
       // X-token headers
       const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'No ay token en la peticieno'
        });
    }
      try {
          //const payload = jwt.verify(
            const {uid, name} = jwt.verify(
              token,
              process.env.SECRET_JWT_SEED
          );
          
          req.uid= uid;
          req.name=name;

      } catch (error) {
        return res.status(401).json({
            ok:false,
            msg:'token no valido'
      });
      }


       next();
}

module.exports={
    validarJWT
}