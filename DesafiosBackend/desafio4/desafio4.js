const express = require('express')
const Contenedor = require('./contenedor')

//Invocando express
const app = express()
//Selección de puerto 8080
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))


//Alta de server en Pto 8080 - Manejo de errores
const server = app.listen(PORT, () => 
console.log(`Servidor corriendo en puerto ${PORT}`)
)
server.on('error', (error) => console.log(`Error en servidor ${error}`))

const prods = new Contenedor('products.txt')

//Uso de Router
const {Router} = express

const Routes = Router()

app.use('/api/productos', Routes)

//Recibiendo todos los productos de la api 
Routes.get('', (req, res) => {
  async function getAll(){
    try{
        let products = await prods.getAll()

        if(!products){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        return res.json(products)
      }
      catch(err){
        throw (`${err} No se pudieron cargar los productos`)
      }  
  }    
getAll()
})

//Recibiendo los productos de la api según ID
Routes.get('/:id', (req, res) => {

  async function getAll(){
    try{
        let products = await prods.getAll()

        const id = Number(req.params.id)

        const productById = products.find(prod => prod.id === id)
      
        if(!productById){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        return res.json(productById)
      }
      catch(err){
        throw (`${err} No se pudieron cargar los productos`)
      }  
  }    
getAll()
})

//Agregando los productos a la api
Routes.post('', (req, res) =>{

    let products = prods.getAll()

    let newProduct = req.body
    prods.save(newProduct)

    if(!products){
      return res.status(404).json({
          error: 'Producto no encontrado'
      })}
})

//Modificando los productos a la api según ID
Routes.put(':id', (req, res) => {
  let products = prods.getAll()

  const id = Number(req.params.id)
  const prodIndex = products.findIndex(prod => prod.id === id)
 
  if(prodIndex === -1){
      return res.status(404).json({
          error: 'Producto no encontrado'
      })
  }

  const body = req.body

  products[prodIndex].title = body.title
  products[prodIndex].price = body.price
  products[prodIndex].thumbnail = body.thumbnail

  return res.json(products[prodIndex])
})



