document.addEventListener('DOMContentLoaded', () => {
    let centrosMedicos = []; //memoria temporal para guardar los datos descargados del JSON
    const inputBuscar = document.getElementById('buscar-texto'); //referencia al input de búsqueda
    const filtroCentro = document.getElementById('filtro-centro');//referencia al select de filtrado por tipo de centro

    // se descarga el JSON y se guarda en la variable global centrosMedicos
    fetch('../json/centros.json')
        .then(respuesta => respuesta.json())
        .then(datos => {
            centrosMedicos = datos;
            construirOpcionesFiltro(centrosMedicos); //se encarga de llenar el <select> dinámicamente con los tipos de centro únicos
            filtrarYMostrarCentros(centrosMedicos); //se encarga de dibujar los centros en pantalla por primera vez, mostrando todos los centros disponibles
        })
        .catch(error => console.error('Error al recuperar datos JSON:', error));

    //listeners para búsqueda en tiempo real y filtrado por tipo de centro
    if (inputBuscar) {
        inputBuscar.addEventListener('input', () => filtrarYMostrarCentros(centrosMedicos));
    } 
    if (filtroCentro) {
        filtroCentro.addEventListener('change', () => filtrarYMostrarCentros(centrosMedicos));
    }
});
//se encarga de construir las opciones del <select> de filtrado dinámicamente, obteniendo los tipos de centro únicos del JSON descargado y agregándolos como opciones al <select>
function construirOpcionesFiltro(centros) {
    const select = document.getElementById('filtro-centro');
    if (!select) return;
    
    select.innerHTML = '<option value="todos">Todos los centros</option>';
    
    const tiposUnicos = [...new Set(centros.map(c => c.tipo))]; //mapa cada centro a su tipo y luego crea un Set para eliminar duplicados, finalmente lo convierte de nuevo a un array
    tiposUnicos.forEach(tipo => {
        const opcion = document.createElement('option');
        opcion.value = tipo;
        opcion.textContent = tipo;
        select.appendChild(opcion);
    });
}
//se encarga de filtrar los centros según el texto que se ingresa y el tipo seleccionado, y luego los muestra en pantalla en tarjetas usando la clase .card de styles.css
function filtrarYMostrarCentros(centros) {
    const contenedor = document.getElementById('contenedor-citas');
    const textoBuscar = document.getElementById('buscar-texto').value.toLowerCase().trim();
    const tipoSeleccionado = document.getElementById('filtro-centro').value;
    //si el contenedor no existe, no hace nada y evita errores
    if (!contenedor) return;
    contenedor.innerHTML = '';
    //se filtran los centros que coinciden con el texto de búsqueda y el tipo seleccionado, usando includes para coincidencia parcial y case insensitive
    const filtrados = centros.filter(centro => {
        const coincideTexto = centro.nombre.toLowerCase().includes(textoBuscar) || 
                              centro.provincia.toLowerCase().includes(textoBuscar) ||
                              centro.canton.toLowerCase().includes(textoBuscar);
        //si el tipo seleccionado es "todos", se considera que coincide con cualquier tipo, de lo contrario, debe coincidir exactamente                     
        const coincideTipo = tipoSeleccionado === 'todos' || centro.tipo === tipoSeleccionado;
        return coincideTexto && coincideTipo;
    });
    //si no hay coincidencias, se muestra un mensaje de estado vacío
    if (filtrados.length === 0) {
        contenedor.innerHTML = '<div class="estado-vacio">No se encontraron centros médicos que coincidan con los criterios establecidos.</div>';
        return;
    }

    //se recorre cada centro filtrado y se crea un elemento visual para mostrar sus detalles, incluyendo un botón para seleccionarlo y proceder al registro de cita
    filtrados.forEach(centro => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card';
        tarjeta.innerHTML = `
            <div>
                <span class="badge">${centro.tipo}</span>
                <h4>${centro.nombre}</h4>
                <p><strong>Ubicación:</strong> ${centro.canton}, ${centro.provincia}</p>
                <p><strong>Teléfono:</strong> ${centro.telefono}</p>
                <p><strong>Disponibilidad:</strong> Cupos Libres Disponibles</p>
            </div>
            <button onclick="seleccionarCentroParaRegistro('${centro.nombre}', '${centro.tipo}')">Seleccionar este Centro</button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

//se encarga de guardar temporalmente el centro seleccionado en el LocalStorage y redirigir al usuario al formulario de registro de cita. Tambien muestra un mensaje de confirmación
function seleccionarCentroParaRegistro(nombre, tipo) {
    const seleccion = { nombre: nombre, tipo: tipo };
    localStorage.setItem('centro_seleccionado_temp', JSON.stringify(seleccion));
    alert('Centro médico seleccionado con éxito, puede proceder a gestionar su registro');
    window.location.href = 'registro.html'; //redirige al formulario de registro para continuar con la cita
}
