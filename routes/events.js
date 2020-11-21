const {Router} = require('express');
const { check } = require('express-validator');
const {getEventos,crearEvento,actualizarEventos,eliminarEventos} = require('../controles/events');
const isDate = require('../helpess/isDate');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.use(validarJWT);
// optener eventos

router.get('/', getEventos);

// Crear un nuevo eventos
router.post(
    '/', 
    [
        check('title','El Titulo es Obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es Obligatoria').custom(isDate),
        check('end','Fecha de Finalizacion es Obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento
    );

// Actualizar  eventos
router.put('/:id',
[
    check('title','El Titulo es Obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es Obligatoria').custom(isDate),
    check('end','Fecha de Finalizacion es Obligatoria').custom(isDate),
    validarCampos
],
actualizarEventos);

// Eliminar eventos
router.delete('/:id', eliminarEventos);

module.exports = router;