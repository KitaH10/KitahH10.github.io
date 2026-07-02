// añade un listener al evento DOMContentLoaded para asegurarse de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // verifica si existe un mensaje de confirmación de cita guardado temporalmente en el sessionStorage
    const mensajePendiente = sessionStorage.getItem('mensaje_exito_ccss');
    if (mensajePendiente) {
        //muestra el mensaje de confirmación al usuario mediante un alert
        alert(mensajePendiente);
        
        //remueve el mensaje del almacenamiento de sesión para evitar que reaparezca al recargar la página
        sessionStorage.removeItem('mensaje_exito_ccss');
    }

    cargarAvisosSalud();
});

// se encarga de cargar los avisos de salud en la página principal, mostrando un mensaje si no hay avisos disponibles
function cargarAvisosSalud() {
    const contenedor = document.getElementById('contenedor-avisos');
    if (!contenedor) return;

    const avisos = [
        { id: 1, titulo: "Campaña de Vacunación Influenza", detalle: "Disponible en todos los Ebais y Clínicas del país para adultos mayores y niños.", centro: "General CCSS" },
        { id: 2, titulo: "Modernización del Sistema Digital", detalle: "La nueva plataforma web interactiva reduce los tiempos de espera presenciales drásticamente.", centro: "Dirección Tecnológica" },
        { id: 3, titulo: "Horarios de Emergencias extendidos", detalle: "Centros médicos regionales mantendrán soporte de atención continuo las 24 horas.", centro: "Red de Hospitales" }
    ];
    
    contenedor.innerHTML = '';
    avisos.forEach(aviso => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card';
        tarjeta.innerHTML = `
            <div>
                <span class="badge">${aviso.centro}</span>
                <h4>${aviso.titulo}</h4>
                <p>${aviso.detalle}</p>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}
