document.addEventListener('DOMContentLoaded', () => {
    cargarAvisosSalud();
});

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