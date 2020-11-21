const {response}= require('express');
const Evento = require('../models/Evento');


const getEventos = async (req,res=response)=>{

    const eventos = await Evento.find()
                                .populate('user'); 
    res.json({
        ok: true,
        eventos
    });
}
const crearEvento =async (req,res=response)=>{
    
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGurdado=  await evento.save();
        res.status(500).json({
            ok: true,
            evento: eventoGurdado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
           msg:'hable con el administrador'
        });
    }
    
}


const actualizarEventos = async (req,res=response)=>{

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
           return res.status(404).json({
                ok: false,
                msg:'Evento no existe con ese id'
            });
        }
        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg:'no tiene privilegio de editar este evento'
            });
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true});
        res.json({
            ok:true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
           msg:'hable con el administrador'
        });
    }
    res.json({
        ok: true,
        msg:'actualizarEventos'
    });
}
const eliminarEventos = async (req,res=response)=>{


    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg:'Evento no existe con ese id'
            });
        }
        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg:'no tiene privilegio de eliminar este evento'
            });
        }

        const eventoEliminado = await Evento.findByIdAndRemove(eventoId);
        res.json({
            ok:true,
            evento: eventoEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
           msg:'hable con el administrador'
        });
    }


}

module.exports={
    getEventos,
    crearEvento,
    actualizarEventos,
    eliminarEventos
}