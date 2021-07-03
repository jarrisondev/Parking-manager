const { connectDB, db } = require('../database/conneccion')

const cancelarMensualidad = async (req, res) => {
	const { placa } = req.body

	if (placa && placa.length === 6) {
		const pool = await connectDB()

		const tieneMensualidad = await pool
			.request()
			.input('PLACA', db.VarChar, placa.toUpperCase())
			.query('EXEC sp_validar_mensualidad @PLACA, DEFAULT')

		if (tieneMensualidad.recordset[0][''] === 1) {
			await pool
				.request()
				.input('PLACA', db.VarChar, placa.toUpperCase())
				.query('DELETE VEHICULOS_MENSUALIDAD WHERE PLACA = @PLACA')

			res.render('mostrar_datos', {
				title: 'Se cancelo con exito su mensualidad',
				data: { first: `Placa: ${placa}`, second: `Esperamos vuelvas pronto` },
			})
		} else {
			res.render('error', { message: 'El vehículo no cuenta con mensualidad' })
		}
	} else {
		res.render('error', { message: 'Datos invalidos' })
	}
}

module.exports = cancelarMensualidad
