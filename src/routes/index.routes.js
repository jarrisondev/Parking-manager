const express = require('express')
const router = express.Router()

const agregarMensualidad = require('../controllers/agregarMensualidad')
const ingresarVehiculo = require('../controllers/ingresarVehiculo')
const salidaVehiculo = require('../controllers/salidaVehiculo')
const datosParqueadero = require('../controllers/datosParqueadero')
const cancelarMensualidad = require('../controllers/cancelarMensualidad')

router.get('/', (req, res) => {
	res.render('index')
})

//agregar vehículo
router.get('/agregar', (req, res) => {
	res.render('agregar_vehiculo')
})
router.post('/agregar', agregarMensualidad)

//ingreso de vehiculo
router.get('/ingresar', (req, res) => {
	res.render('ingresar_vehiculo')
})
router.post('/ingresar', ingresarVehiculo)

// salida de vehículo
router.get('/salida', (req, res) => {
	res.render('salida_vehiculo')
})
router.post('/salida', salidaVehiculo)

// cancelar mensualidad
router.get('/cancelar', (req, res) => {
	res.render('cancelar_mensualidad')
})
router.post('/cancelar', cancelarMensualidad)

//estadisticas del parqueadero
router.get('/parqueadero', datosParqueadero)

module.exports = router
