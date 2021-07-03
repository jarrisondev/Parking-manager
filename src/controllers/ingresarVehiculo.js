const { connectDB, db } = require('../database/conneccion')

const ingresarVehiculo = async (req, res) => {
	const { placa, color } = req.body

	if (placa && placa.length === 6 && color && color.length <= 10) {
		const pool = await connectDB()

		const existeVehiculo = await pool
			.request()
			.input('PLACA', db.VarChar, placa)
			.query('SELECT dbo.fn_verificar_vehiculo_parqueadero(@PLACA)')

		if (existeVehiculo.recordset[0][''] === 0) {
			const tieneMensualidad = await pool
				.request()
				.input('PLACA', db.VarChar, placa.toUpperCase())
				.input('COLOR', db.VarChar, color.toUpperCase())
				.query('EXEC sp_validar_mensualidad @PLACA, @COLOR')

			if (tieneMensualidad.recordset[0][''] === 1) {
				//inserta los datos a la tabla
				await pool
					.request()
					.input('PLACA', db.VarChar, placa.toUpperCase())
					.input('COLOR', db.VarChar, color.toUpperCase())
					.query(
						'INSERT INTO VEHICULOS_EN_PARQUEADERO VALUES (@PLACA, @COLOR, DEFAULT, 1)'
					)

				res.render('mostrar_datos', {
					title: 'Ingresó vehículo con mensualidad',
					data: { first: `Placa: ${placa}`, second: `Color: ${color}` },
				})
			} else {
				const hayCupos = await pool
					.request()
					.query('SELECT dbo.fn_cupos_parqueadero()')

				if (hayCupos.recordset[0][''] < parseInt(process.env.PARKING_SIZE)) {
					//inserta los datos a la tabla
					await pool
						.request()
						.input('PLACA', db.VarChar, placa.toUpperCase())
						.input('COLOR', db.VarChar, color.toUpperCase())
						.query(
							'INSERT INTO VEHICULOS_EN_PARQUEADERO VALUES (@PLACA, @COLOR, DEFAULT, 0)'
						)

					res.render('mostrar_datos', {
						title: 'Ingresó vehículo sin mensualidad',
						data: { first: `Placa: ${placa}`, second: `Color: ${color}` },
					})
				} else {
					res.render('error', {
						message: 'El parqueadero se encuentra lleno',
					})
				}
			}
		} else {
			res.render('error', {
				message: 'Ya hay un vehículo con esta placa dentro del parqueadero',
			})
		}
	} else {
		res.render('error', { message: 'Datos invalidos' })
	}
}

module.exports = ingresarVehiculo
