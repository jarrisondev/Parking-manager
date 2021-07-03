const { connectDB, db } = require('../database/conneccion')

const agregarMensualidad = async (req, res) => {
	const { placa, marca, modelo, color, nombre_c } = req.body
	if (
		placa &&
		placa.length === 6 &&
		marca &&
		marca.length <= 30 &&
		modelo &&
		modelo.length <= 10 &&
		color &&
		color.length <= 10 &&
		nombre_c &&
		nombre_c.length <= 30
	) {
		const pool = await connectDB()

		const hayCuposParqueadero = await pool
			.request()
			.query('SELECT dbo.fn_cupos_parqueadero()')

		if (
			hayCuposParqueadero.recordset[0][''] < parseInt(process.env.PARKING_SIZE)
		) {
			try {
				await pool
					.request()
					.input('placa', db.VarChar, placa.toUpperCase())
					.input('marca', db.VarChar, marca.toUpperCase())
					.input('modelo', db.VarChar, modelo.toUpperCase())
					.input('color', db.VarChar, color.toUpperCase())
					.input('nombre_c', db.VarChar, nombre_c.toUpperCase())
					.query(
						'INSERT INTO VEHICULOS_MENSUALIDAD VALUES (@placa, @marca, @modelo, @color, @nombre_c)'
					)
				res.render('mostrar_datos', {
					title: 'Se registro vehículo con exito',
					data: { first: `Placa: ${placa}`, second: `Color: ${color}` },
				})
			} catch (err) {
				res.render('error', {
					message: 'Ya se encuentra un vehículo con la misma placa',
				})
			}
		} else {
			res.render('error', { message: 'No fue posible, parqueadero lleno' })
		}
	} else {
		res.render('error', { message: 'Datos invalidos' })
	}
}

module.exports = agregarMensualidad
