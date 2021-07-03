const { connectDB, db } = require('../database/conneccion')

const salidaVehiculo = async (req, res) => {
	const { placa } = req.body

	if (placa && placa.length === 6) {
		const pool = await connectDB()

		const existeVehiculo = await pool
			.request()
			.input('PLACA', db.VarChar, placa)
			.query('SELECT dbo.fn_verificar_vehiculo_parqueadero(@PLACA)')

		if (existeVehiculo.recordset[0][''] === 1) {
			const tieneMensualidad = await pool
				.request()
				.input('PLACA', db.VarChar, placa.toUpperCase())
				.query('EXEC sp_validar_mensualidad  @PLACA, DEFAULT')

			if (tieneMensualidad.recordset[0][''] === 1) {
				//elimina el vehículo del parqueadero
				await pool
					.request()
					.input('PLACA', db.VarChar, placa.toUpperCase())
					.query('DELETE VEHICULOS_EN_PARQUEADERO WHERE PLACA = @PLACA')

				res.render('mostrar_datos', {
					title: `El vehículo salío con exito.`,
					data: {
						first: `Placa: ${placa}`,
						second: `Saldo a pagar: No aplica`,
					},
				})
			} else {
				//trae el saldo a pagar del vehiculo
				const saldoPagar = await pool
					.request()
					.input('PLACA', db.VarChar, placa.toUpperCase())
					.query('EXEC sp_total_pagar @PLACA')

				//elimina el vehículo del parqueadero
				await pool
					.request()
					.input('PLACA', db.VarChar, placa.toUpperCase())
					.query('DELETE VEHICULOS_EN_PARQUEADERO WHERE PLACA = @PLACA')

				res.render('mostrar_datos', {
					title: `El vehículo salío con exito.`,
					data: {
						first: `Placa: ${placa}`,
						second: `Saldo a pagar: ${saldoPagar.recordset[0]['']}`,
					},
				})
			}
		} else {
			res.render('error', {
				message: 'Ese vehículo no ha ingresado al parqueadero',
			})
		}
	} else {
		res.render('error', { message: 'Datos invalidos' })
	}
}

module.exports = salidaVehiculo
