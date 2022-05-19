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
                console.log("Archivo leido")
                return content        
        }catch(err){
            console.error(err + 'No se puede leer el archivo')
    }}
//Fn para escritura de nuevos datos    
    async write(datos, msg){
        try{
            //Se escriben nuevos datos pasados como string
            await fs.promises.writeFile('./' + this.name , JSON.stringify (datos, null, 2))
            console.log(`Se escribió un msj en el archivo. El msj es ${msg} `)
        }catch(err){
            console.error(err + 'No se pudo escribir el archivo')
        }
    }

//Fn para guardar los nuevos datos añadidos    
    async save (product){
        
        let nextId =  1
        let nextProduct = {}

        let content = await this.read()
        let datos = JSON.parse(content)
        //Si no hay contenido en el contenedor, se guardará el nuevo contenido con ID 
        //comenzando en 1. Por el contrario, el nuevo ID será 1 numero mayor al ya existente 
        if (!content) {
            product.id = nextId
            nextProduct = [product]
        } else {
            product.id = datos[datos.length - 1].id + 1
            nextProduct = product
        }
        //Se agregan los nuevos datos al array del contenedor
        datos.push(nextProduct)

        await this.write(datos, 'Producto añadido')
    }

//Fn para para traer un producto por su ID en forma de objeto
    async getById(num) {
        let content = await this.read()
        let datos = JSON.parse(content)

        let result = datos.filter(product => product.id == num)
        return result
    }

//Fn para para traer todos los productos en forma de objetos
    async getAll() {
        let data = await this.read()
        let datos = JSON.parse(data)

        return datos
    }

//Fn para para eliminar un producto por su ID.
    async deleteById(num) {
        //Se lee el producto, se convierte a objeto y se busca por ID
        let content = await this.read()
        let datos = JSON.parse(content)

        let product = datos.find(product => product.id == num)
        
        //Si el producto existe, se crea un indice para luego eliminarlo según el valor requerido
        if(product) {
            let index = datos.indexOf(product)
            console.log(index)
            datos.splice(index, 1)
            await this.write(datos, `Se ha eliminado el producto con el Id: ${num}`)
        } else {
            console.log(`No se encuentra el producto con el Id: ${num}`)
        }
    }
//Fn para para eliminar todos los productos.
    async deleteAll() {
        let content = []
        await this.write(content, "Se eliminaron todos los productos")
    }
}

//Ej. contenedor nuevo
let contenedor = new Contenedor('products.txt')

//Fn para para testear el funcionamiento de los metodos del contenedor.
async function test(){
    //Datos de un nuevo producto a agregar
    const nextProduct = {
        title: 'newProduct',
        price: 1000,
        thumbnail: 'url'
    }

    //Se guarda el nuevo producto
    //Se leen todos los productos por consola
    console.log(await contenedor.getAll())
}
test()

module.exports = Contenedor