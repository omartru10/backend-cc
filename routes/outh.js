/*
rutas de usuario
host +/api/outh
*/
const {Router} = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {crearUsuario, loginUsuario, revalidarToken} = require('../controles/outh');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const {generarJWT} = require('../helpess/jwt');



router.post(
    '/new',
[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','El password debe deer de 6 caracteres crear').isLength({min:6}),
    validarCampos
],
async(req,res=response)=>{
    const {email,password} = req.body;
   try{
       let usuario = await Usuario.findOne({email});
       if(usuario){
       return  res.status(400).json({
            ok:false,
            msg:'un usuario existe con este correo'
        });
       }
         usuario = new Usuario(req.body);
         //incriptar contraseña
         const salt = bcrypt.genSaltSync();
         usuario.password= bcrypt.hashSync(password, salt);
        await usuario.save();
        // generar jwtoken
       const token = await generarJWT(usuario.id, usuario.name);
        return res.status(201).json({
            ress: true,
            uid:usuario.id,
            name: usuario.name,
            token            
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        });
    }
} );

router.post(
    '/',
    [  check('email','El email es obligatorio').isEmail(),
    check('password','El password debe deer de 6 caracteres login').isLength({min:6}),
    validarCampos
    ],
    loginUsuario
    );
router.get('/renew',validarJWT,revalidarToken);


module.exports = router;