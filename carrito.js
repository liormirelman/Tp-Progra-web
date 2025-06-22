function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarAnuncioCarrito(texto) {
    var anuncio = document.getElementById('anuncio-carrito');
    if (!anuncio) return;
    anuncio.textContent = texto;
    anuncio.style.display = 'block';
    anuncio.style.opacity = '1';
    setTimeout(function () {
        anuncio.style.opacity = '0';
        setTimeout(function () {
            anuncio.style.display = 'none';
        }, 400);
    }, 1200);
}

function agregarAlCarrito(nombre, precio) {
    let carrito = obtenerCarrito();
    const item = carrito.find(i => i.nombre === nombre);
    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarCarrito(carrito);
    mostrarAnuncioCarrito(`"${nombre}" agregado al carrito`);
}

function renderizarCarrito() {
    const lista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('carrito-total');
    if (!lista || !totalSpan) return;
    let carrito = obtenerCarrito();
    lista.innerHTML = '';
    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';
        li.innerHTML = `
            <div>
                ${item.nombre} 
                <span>x${item.cantidad} - $${item.precio * item.cantidad}</span>
            </div>
            <div class="d-flex align-items-center gap-2 mt-2 mt-md-0">
                <input type="number" min="1" value="${item.cantidad}" class="form-control form-control-sm cantidad-input" style="width:70px;">
                <button class="btn btn-sm btn-secondary actualizar-btn">Actualizar</button>
                <button class="btn btn-sm btn-danger eliminar-btn">Eliminar</button>
            </div>
        `;

        li.querySelector('.eliminar-btn').addEventListener('click', function () {
            eliminarDelCarrito(item.nombre);
        });

        li.querySelector('.actualizar-btn').addEventListener('click', function () {
            const nuevaCantidad = parseInt(li.querySelector('.cantidad-input').value, 10);
            if (nuevaCantidad > 0) {
                actualizarCantidad(item.nombre, nuevaCantidad);
            }
        });
        lista.appendChild(li);
    });
    totalSpan.textContent = `$${total}`;
}

function actualizarCantidad(nombre, cantidad) {
    let carrito = obtenerCarrito();
    const item = carrito.find(i => i.nombre === nombre);
    if (item && cantidad > 0) {
        item.cantidad = cantidad;
        guardarCarrito(carrito);
        renderizarCarrito();
        mostrarAnuncioCarrito(`Cantidad de "${nombre}" actualizada`);
    }
}

function eliminarDelCarrito(nombre) {
    let carrito = obtenerCarrito();
    const item = carrito.find(i => i.nombre === nombre);
    if (item) {
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            carrito = carrito.filter(i => i.nombre !== nombre);
        }
        guardarCarrito(carrito);
        renderizarCarrito();
    }
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    renderizarCarrito();
    mostrarAnuncioCarrito("Carrito vaciado");
}

function comprarCarrito() {
    let carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarAnuncioCarrito("El carrito está vacío");
        return;
    }
    let resumen = "¡Gracias por tu compra!\n\nResumen:\n";
    carrito.forEach(item => {
        resumen += `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}\n`;
    });
    let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    resumen += `\nTotal: $${total}`;
    alert(resumen);

    localStorage.removeItem('carrito');
    renderizarCarrito();
    mostrarAnuncioCarrito("¡Compra realizada con éxito!");
}

window.agregarAlCarrito = agregarAlCarrito;
window.renderizarCarrito = renderizarCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.comprarCarrito = comprarCarrito;
window.actualizarCantidad = actualizarCantidad;

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('carrito-lista')) {
        renderizarCarrito();
        var vaciarBtn = document.getElementById('vaciar-btn');
        if (vaciarBtn) {
            vaciarBtn.addEventListener('click', vaciarCarrito);
        }
        var comprarBtn = document.getElementById('comprar-btn');
        if (comprarBtn) {
            comprarBtn.addEventListener('click', comprarCarrito);
        }
    }
});