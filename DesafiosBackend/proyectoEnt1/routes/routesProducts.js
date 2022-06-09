const Contenedor = require('../containerProducts')
const express = require('express')


//Uso de Router
const {Router} = express

const routes = Router()

const prods = new Contenedor('products.txt')

//Recibiendo todos los productos de la api 
routes.get('', (req, res) => {
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
routes.get('/:id', (req, res) => {

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
routes.post('/', (req, res) =>{

    let products = prods.getAll()

    let newProduct = req.body

    prods.saveProducts(newProduct)

    if(!products){
      return res.status(404).json({
          error: 'Producto no encontrado'
      })}
})

//Modificando los productos a la api según ID
routes.put("/:id", (req, res) =>{
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
    } catch (error) {lete
      throw Error("Error en put modificacion productos")
    }
  }
  modifyById();

})

//Eliminando los productos a la api según ID
routes.delete('/:id', (req, res) =>{
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

module.exports = routes

