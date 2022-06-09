//Import fs
const fs = require('fs')

//Contenedor de productos
class Contenedor {
    constructor (name){
        this.name = name
}

//Fn para lectura de archivo contenedor
    async read (){
        try{
            //Se lee archivo devolviendo su contenido
            let content = await fs.promises.readFile('./' + this.name , 'utf-8')
                console.log("Archivo de carritos leido")
                return content        
        }catch(err){
            console.error(err + 'No se puede leer el archivo')
    }}
//Fn para escritura de nuevos datos    
    async write(datos, msg){
        try{
            //Se escriben nuevos datos pasados como string
            await fs.promises.writeFile('./' + this.name , JSON.stringify (datos, null, 2))
            console.log(`Se escribió un msj en el archivo de carritos.`)
        }catch(err){
            console.error(err + 'No se pudo escribir el archivo')
        }
    }

//Fn para guardar los nuevos datos añadidos    
    async saveCart (cart){
        
        let nextId =  1
        let nextCart = {}

        let content = await this.read()
        let datos = JSON.parse(content)
        //Si no hay contenido en el contenedor, se guardará el nuevo contenido con ID 
        //comenzando en 1. Por el contrario, el nuevo ID será 1 numero mayor al ya existente 
        if (!content) {
            cart.cartId = nextId
            nextCart = [cart]
        } else {
            cart.cartId = datos[datos.length - 1].cartId + 1
            nextCart = cart
        }
        //Se agregan los nuevos datos al array del contenedor
        datos.push(nextCart)

        await this.write(datos, 'Carrito añadido')
    }

//Fn para para traer todos los productos en forma de objetos
    async getAll() {
        let data = await this.read()
        let datos = JSON.parse(data)

        return datos
    }
}



module.exports = Contenedor