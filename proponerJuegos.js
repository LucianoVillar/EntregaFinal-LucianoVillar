
//Funciones

function editarCantidad (producto, nuevaCantidad){


//Busco indice del producto en el carrito

const indiceProductoExiste = carrito.findIndex( (productoCarrito) => {

    return productoCarrito.nombre === producto.nombre;

});

//Si el producto esta en el carrito

if(indiceProductoExiste !== -1) {


    //Le cambiamos el atributo cantidad por la nueva que se escribio en el input
    carrito[indiceProductoExiste].cantidad = nuevaCantidad;
}

//Renderizar el carrito
renderizarCarrito(carrito);

//Guardo en el LS
agregarCarritoAlLS();

}


function renderizarTotal() {

//Calculo el total
    const total = carrito.reduce( (acc, productoCarrito) => {

        return acc + (productoCarrito.precio * productoCarrito.cantidad);

    }, 0);

   //Añado el total al span
    totalSpan.innerHTML = `$${total}`;
}


function obtenerCarritoDelLS() {

    let carrito = [];
    const carritoLS = localStorage.getItem("carritoReserva");

    if(carritoLS !== null){

        carrito = JSON.parse(carritoLS);

    }

    return carrito;

};

function agregarCarritoAlLS() {

    localStorage.setItem("carritoReserva", JSON.stringify(carrito));

}




function agregarAlCarrito(producto) {

//Busco indice del producto en el carrito

const indiceProductoExiste = carrito.findIndex( (productoCarrito) => {

    return productoCarrito.nombre === producto.nombre;

});

//Si el producto no esta en el carrito

if(indiceProductoExiste === -1) {


    // Agrego un nuevo objeto al array de carrito
    carrito.push({

        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
    });
    } else {

        // Modifico la cantidad del producto existente en el carrito
        carrito[indiceProductoExiste].cantidad++;
    }
    //Renderizar el carrito
    renderizarCarrito(carrito);

    //Guardo en el LS
agregarCarritoAlLS();


};

function renderizarCarrito(productos) {
    // Limpio el contenedor
tbodyCarrito.innerHTML = "";

for(const producto of productos) {

    //Creo el tr
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.innerHTML = `${producto.nombre}`;

    const tdPrecio = document.createElement("td");
    tdPrecio.innerHTML = `$${producto.precio}`;

    const tdCantidad = document.createElement("td");

    const spanCantidad = document.createElement("span");
    spanCantidad.innerHTML = `${producto.cantidad}`;

    tdCantidad.append(spanCantidad);

    //Agrego evento de click al span de la cantidad

    spanCantidad.addEventListener("click", () => {
        //ocultamos el span
        spanCantidad.className = "ocultar";

        //Creamos un input
        const inputCantidad = document.createElement("input");
        inputCantidad.value = producto.cantidad;

        inputCantidad.addEventListener("change", () => {

        const nuevaCantidad = inputCantidad.value;

        //Mostrar nuevamente el span
        spanCantidad.className = "mostrar";

        //Eliminar el input
        inputCantidad.remove();

        //Editar la cantidad
        editarCantidad(producto, nuevaCantidad);

        });
        //Agregamos el input al td de cantidad
        tdCantidad.append(inputCantidad);
    });

    //Agrego td al tr

    tr.append(tdNombre, tdPrecio, tdCantidad);

    //Agrego tr al tbody
    tbodyCarrito.append(tr);
};
    //Renderizar Total
    renderizarTotal();
}



function renderizarProductos(productos) {

    // Limpio el contenedor
listaProductos.innerHTML = "";

for(const producto of productos) {

    //Crear el div principal
    const div = document.createElement("div");
    div.className = "producto";

    const h2 = document.createElement("h2");
    h2.innerHTML = `${producto.nombre}`;

    const p = document.createElement("p");
    p.innerHTML = `$${producto.precio}`;

    const button = document.createElement("button");
    button.innerHTML = "Proponer Juegos";

    button.addEventListener("click", () => {

        agregarAlCarrito(producto);

    });

    //Agregamos los textos y el boton al div del producto
    div.append(h2, p, button);

    //Agregamos el div al contenedor de los productos
    listaProductos.append(div);


}

}

//Inicio del Programa

const carrito = obtenerCarritoDelLS();

const listaProductos = document.getElementById("listaProductos");

const tbodyCarrito = document.getElementById("tbodyCarrito");

const totalSpan = document.querySelector("#total span");

//Obtengo los productos del archivo JSON

fetch("/productos.json")
    .then( (response) => {
        return response.json(); 
})
    .then((responseProductos) => {
        // Renderizo los productos que vienen del JSON
        renderizarProductos(responseProductos);
});

//Renderizar los productos
renderizarCarrito(carrito);


