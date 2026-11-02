const express = require('express');
const router = express.Router();
const recetaController = require('../App/Http/Controllers/recetaController');

router.get('/', recetaController.obtenerRecetas);
router.get('/estadisticas', recetaController.obtenerEstadisticas);
router.get('/:id', recetaController.obtenerRecetaPorId);
router.post('/', recetaController.crearReceta);
router.patch('/:id/favorito', recetaController.toggleFavorito);
router.patch('/:id', recetaController.updateReceta);
router.put('/:id', recetaController.replaceReceta);
router.delete('/:id', recetaController.destroyReceta);

module.exports = router;
