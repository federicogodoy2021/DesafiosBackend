const express = require('express')
const { all } = require('express/lib/application')
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
Routes.post('/', (req, res) =>{

    let products = prods.getAll()

    let newProduct = req.body

    prods.save(newProduct)

    if(!products){
      return res.status(404).json({
          error: 'Producto no encontrado'
      })}
})

//Modificando los productos a la api según ID
Routes.put("/:id", (req, res) =>{
  let { title, price, thumbnail } = req.body;

  async function modifyById(){
    try {
      let modifiedProduct = await prods.getById(parseInt(req.params.id))

      if (Object.keys(modifiedProduct).length === 0) {
        res.send({ error : 'producto no encontrado' })
      }
      else{
        modifiedProduct = {
        title,
        price,
        thumbnail,
        id : parseInt(req.params.id)
      }
        let allProducts = await prods.read();
        allProducts = (JSON.parse(allProducts, null, 2))

        let auxId = parseInt(req.params.id) - 1
        allProducts.splice(auxId, 1, modifiedProduct)

        await prods.write(allProducts, "Producto modificado correctamente")

        res.send(allProducts);
      }
    } catch (error) {
      throw Error("Error en put modificacion productos")
    }
  }
  modifyById();

})

//Eliminando los productos a la api según ID
Routes.delete('/:id', (req, res) =>{
  async function deleteProductById(){
    try {
      let productToDelete = await prods.getById(parseInt(req.params.id))

      if (Object.keys(productToDelete).length === 0) {
        res.send({ error : 'producto no encontrado' })
      }
      else{
        await prods.deleteById(parseInt(req.params.id))  
        res.send(await prods.getAll())}
      } catch (error) {
      
      throw Error ("Error en el delete por id");
}}
deleteProductById()
})
