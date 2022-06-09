const Contenedor = require('../containerCarts')
const express = require('express')


//Uso de Router
const {Router} = express

const routesCart = Router()

const carts = new Contenedor('carts.txt')


//Agregando los productos a la api
routesCart.post('/', (req, res) =>{

    let cart = carts.getAll()

    let newCart = req.body

    carts.saveCart([newCart])

    if(!cart){
      return res.status(404).json({
          error: 'Carrito no encontrado'
      })}
})
//Recibiendo todos los productos de la api 
routesCart.get('', (req, res) => {
    async function getAll(){
      try{
          let cart = await carts.getAll()
  
          if(!cart){
              return res.status(404).json({
                  error: 'Carrito no encontrado'
              })
          }
          return res.json(cart)
        }
        catch(err){
          throw (`${err} No se pudieron cargar los carritos`)
        }  
    }    
  getAll()
  })


module.exports = routesCart

