const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpess/jwt');
const { validationResult } = require('express-validator');

const crearUsuario= async(req,res=response)=>{
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
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        });
    }
}

// login de usuario
const loginUsuario=async(req,res=response)=>{
    const {email,password} = req.body;
   try{
       const usuario = await Usuario.findOne({email});
       if(!usuario){
       return  res.status(400).json({
            ok:false,
            msg:'el usuario no existe con ese email'
        });
       }
       //confirmar passwor
       const validPasswor = bcrypt.compareSync(password,usuario.password);
       if(!validPasswor){
        return res.status(400).json({
            ok:false,
            msg:'contraseña no valido'
        });
       }
       const token = await generarJWT(usuario.id, usuario.name);
       res.status(201).json({
        ress: true,
        uid:usuario.id,
        name: usuario.name,
        token
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        });
    }
}
const revalidarToken= async(req,res=response)=>{

    const {uid, name}= req;
    // generar un nuevo token y retornarlo en la peticion
    const token = await generarJWT(uid,name);
    res.json({
        ress: true,
        uid,
        name,
        token
    });
}




module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}