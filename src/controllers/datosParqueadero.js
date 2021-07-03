const { connectDB } = require('../database/conneccion')

const datosParqueadero = async (req, res) => {
	const pool = await connectDB()

	const vehiculosConM = await pool
		.request()
		.query(
			'SELECT COUNT(*) FROM VEHICULOS_EN_PARQUEADERO WHERE MENSUALIDAD = 1'
		)
	const vehiculosSinM = await pool
		.request()
		.query(
			'SELECT COUNT(*) FROM VEHICULOS_EN_PARQUEADERO WHERE MENSUALIDAD = 0'
		)
	const total = await pool
		.request()
		.query('SELECT COUNT(*) FROM VEHICULOS_EN_PARQUEADERO')
	const espacioSinM = await pool
		.request()
		.query('SELECT dbo.fn_cupos_parqueadero()')

	const espacioConM = await pool
		.request()
		.query('SELECT dbo.fn_cupos_mensualidad()')

	const datosVehiculosP = await pool
		.request()
		.query(
			'SELECT PLACA, COLOR, CONVERT(varchar,FECHA,22) FECHA, MENSUALIDAD FROM VEHICULOS_EN_PARQUEADERO '
		)

	const datosVehiculosM = await pool
		.request()
		.query('SELECT * FROM VEHICULOS_MENSUALIDAD ')

	const datos = {
		tamaño: process.env.PARKING_SIZE,
		vehiculosConM: vehiculosConM.recordset[0][''],
		vehiculosSinM: vehiculosSinM.recordset[0][''],
		total: total.recordset[0][''],
		espacioSinM: process.env.PARKING_SIZE - espacioSinM.recordset[0][''],
		espacioConM: espacioConM.recordset[0][''],
		datosParqueadero: datosVehiculosP.recordset,
		datosMensualidad: datosVehiculosM.recordset,
	}
	res.render('datos_parqueadero', datos)
}

module.exports = datosParqueadero
