const routesProducts = require('./routes/routesProducts')
const routesCart = require('./routes/routesCart')

const express = require('express')

//Invocando express
const app = express()
//Selección de puerto 8080
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.use("/api/products", routesProducts)
app.use("/api/carrito", routesCart)

//Alta de server en Pto 8080 - Manejo de errores
const server = app.listen(PORT, () => 
console.log(`Servidor corriendo en puerto ${PORT}`)
)
server.on('error', (error) => console.log(`Error en servidor ${error}`))
