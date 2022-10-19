export class Producto {
    constructor(nombre, precio, imagen, descripcion, id, quantity){
        this.nombre = nombre    
        this.precio = precio    
        this.imagen = imagen    
        this.descripcion = descripcion    
        this.id = id    
        this.quantity = quantity    
    
    }

    sumarCantidad(){
        this.quantity++
    }

    restarCantidad(){
        this.quantity--
    }

}