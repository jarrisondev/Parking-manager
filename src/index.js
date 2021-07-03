const { config } = require('dotenv')
config()
const express = require('express')
const app = express()
const path = require('path')
const router = require('./routes/index.routes')

app.set('PORT', process.env.PORT || 5000)

//middlewares
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))

//routes
app.use(router)

app.listen(app.get('PORT'), () => {
	console.log('Server on PORT', app.get('PORT'))
})
