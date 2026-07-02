document.addEventListener('DOMContentLoaded', () => {
    const btnLimpiar = document.getElementById('btn-limpiar-todo');

    actualizarHistorialVisual();

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (confirm('¿Está completamente seguro de que desea eliminar todo el historial de citas programadas?')) {
                localStorage.removeItem('citas_locales');
                actualizarHistorialVisual();
                alert('El historial se ha vaciado correctamente.');
            }
        });
    }
});

function actualizarHistorialVisual() {
    const contenedor = document.getElementById('contenedor-historial');
    const btnLimpiar = document.getElementById('btn-limpiar-todo');
    if (!contenedor) return;

    const historial = JSON.parse(localStorage.getItem('citas_locales')) || [];
    contenedor.innerHTML = '';

    if (historial.length === 0) {
        contenedor.innerHTML = '<div class="estado-vacio">No registra ninguna cita médica agendada en este navegador.</div>';
        if (btnLimpiar) btnLimpiar.style.display = 'none';
        return;
    }

    if (btnLimpiar) btnLimpiar.style.display = 'block';

    historial.forEach(cita => {
        const elemento = document.createElement('div');
        elemento.className = 'cita-registrada-card';
        elemento.innerHTML = `
            <div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Registrada: ${cita.fecha_registro}</p>
                <h4 style="margin-bottom: 0.25rem;">${cita.centro_medico}</h4>
                <p><strong>Paciente:</strong> ${cita.nombre} (ID: ${cita.cedula})</p>
                <p><strong>Fecha reservada:</strong> ${cita.fecha_cita}</p>
                <p><strong>Horario Reservado:</strong> <span style="color: var(--primary-blue); font-weight: bold;">${cita.hora}</span></p>
                <p style="margin-top: 0.25rem; font-style: italic; color: #475569;">"Motivo: ${cita.motivo}"</p>
            </div>
            <button class="btn-eliminar" onclick="eliminarCitaEspecifica(${cita.id})">Cancelar Cita</button>
        `;
        contenedor.appendChild(elemento);
    });
}

function eliminarCitaEspecifica(idCita) {
    if (confirm('¿Desea cancelar de forma definitiva este espacio de atención médica?')) {
        let historial = JSON.parse(localStorage.getItem('citas_locales')) || [];
        historial = historial.filter(cita => cita.id !== idCita);
        localStorage.setItem('citas_locales', JSON.stringify(historial));
        actualizarHistorialVisual();
    }
}