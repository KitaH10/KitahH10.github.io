document.addEventListener('DOMContentLoaded', () => {
    let centrosMedicos = [];
    const inputBuscar = document.getElementById('buscar-texto');
    const filtroCentro = document.getElementById('filtro-centro');

  
    fetch('../json/centros.json')
        .then(respuesta => respuesta.json())
        .then(datos => {
            centrosMedicos = datos;
            construirOpcionesFiltro(centrosMedicos);
            filtrarYMostrarCentros(centrosMedicos);
        })
        .catch(error => console.error('Error al recuperar datos JSON:', error));

   
    if (inputBuscar) {
        inputBuscar.addEventListener('input', () => filtrarYMostrarCentros(centrosMedicos));
    } 
    if (filtroCentro) {
        filtroCentro.addEventListener('change', () => filtrarYMostrarCentros(centrosMedicos));
    }
});

function construirOpcionesFiltro(centros) {
    const select = document.getElementById('filtro-centro');
    if (!select) return;
    
    select.innerHTML = '<option value="todos">Todos los centros</option>';
    
    const tiposUnicos = [...new Set(centros.map(c => c.tipo))];
    tiposUnicos.forEach(tipo => {
        const opcion = document.createElement('option');
        opcion.value = tipo;
        opcion.textContent = tipo;
        select.appendChild(opcion);
    });
}

function filtrarYMostrarCentros(centros) {
    const contenedor = document.getElementById('contenedor-citas');
    const textoBuscar = document.getElementById('buscar-texto').value.toLowerCase().trim();
    const tipoSeleccionado = document.getElementById('filtro-centro').value;

    if (!contenedor) return;
    contenedor.innerHTML = '';

    const filtrados = centros.filter(centro => {
        const coincideTexto = centro.nombre.toLowerCase().includes(textoBuscar) || 
                              centro.provincia.toLowerCase().includes(textoBuscar) ||
                              centro.canton.toLowerCase().includes(textoBuscar);
                              
        const coincideTipo = tipoSeleccionado === 'todos' || centro.tipo === tipoSeleccionado;
        return coincideTexto && coincideTipo;
    });

    if (filtrados.length === 0) {
        contenedor.innerHTML = '<div class="estado-vacio">No se encontraron centros médicos que coincidan con los criterios establecidos.</div>';
        return;
    }


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


function seleccionarCentroParaRegistro(nombre, tipo) {
    const seleccion = { nombre: nombre, tipo: tipo };
    localStorage.setItem('centro_seleccionado_temp', JSON.stringify(seleccion));
    alert('Centro médico seleccionado con éxito. Proceda a gestionar su registro.');
    window.location.href = 'registro.html'; // Redirige directamente al nuevo formulario
}
