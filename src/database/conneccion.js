const db = require('mssql')

const dbSettings = {
	user: process.env.USER_DB,
	password: process.env.PASSWORD_DB,
	server: process.env.SERVER_NAME,
	database: process.env.DATABASE,
	port: parseInt(process.env.PORT_DB),
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
}

const connectDB = async () => {
	try {
		const pool = await db.connect(dbSettings)
		return pool
	} catch (err) {
		console.error(err)
	}
}

module.exports = { connectDB, db }
