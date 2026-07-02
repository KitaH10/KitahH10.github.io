document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-registro');
    const inputNombre = document.getElementById('nombre-completo');
    const inputCedula = document.getElementById('cedula-usuario');
    const inputMotivo = document.getElementById('motivo-consulta');
    const inputFecha = document.getElementById('fecha-cita');
    const selectHorario = document.getElementById('horario-cita');

    mostrarCentroPreseleccionado();
    cargarHorariosDisponibles();

    if (inputNombre) inputNombre.addEventListener('input', validarNombreRealTime);
    if (inputCedula) inputCedula.addEventListener('input', validarCedulaRealTime);
    if (inputMotivo) inputMotivo.addEventListener('input', validarMotivoRealTime);
    if (inputFecha) inputFecha.addEventListener('change', () => {
        validarFechaRealTime();
        cargarHorariosDisponibles();
    });
    if (selectHorario) selectHorario.addEventListener('change', validarHorarioRealTime);

    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const v1 = validarNombreRealTime();
            const v2 = validarCedulaRealTime();
            const v3 = validarMotivoRealTime();
            const v4 = validarFechaRealTime();
            const v5 = validarHorarioRealTime();

            if (!v1 || !v2 || !v3 || !v4 || !v5) {
                alert('Por favor, corrija los campos marcados en rojo antes de continuar.');
                return;
            }

            const centroGuardado = JSON.parse(localStorage.getItem('centro_seleccionado_temp')) || { nombre: "Atención General", tipo: "General" };

            const nuevaCita = {
                id: Date.now(),
                nombre: inputNombre.value.trim(),
                cedula: inputCedula.value.trim(),
                motivo: inputMotivo.value.trim(),
                centro_medico: centroGuardado.nombre,
                tipo_centro: centroGuardado.tipo,
                fecha_cita: inputFecha.value,
                hora: selectHorario.value,
                fecha_registro: new Date().toLocaleString()
            };

            let historial = JSON.parse(localStorage.getItem('citas_locales')) || [];
            historial.push(nuevaCita);
            localStorage.setItem('citas_locales', JSON.stringify(historial));

            mostrarMensajeExito(`¡Cita agendada con éxito en el ${centroGuardado.nombre} el día ${inputFecha.value} a las ${selectHorario.value}!`);
            
            formulario.reset();
            limpiarClasesValidacion();
            localStorage.removeItem('centro_seleccionado_temp');
            mostrarCentroPreseleccionado();
            cargarHorariosDisponibles(); 
        });
    }
});

function cargarHorariosDisponibles() {
    const selectHorario = document.getElementById('horario-cita');
    const inputFecha = document.getElementById('fecha-cita');
    if (!selectHorario) return;

    const centroGuardado = JSON.parse(localStorage.getItem('centro_seleccionado_temp'));
    
    if (!centroGuardado) {
        selectHorario.innerHTML = '<option value="">Seleccione primero un centro médico desde la búsqueda...</option>';
        selectHorario.disabled = true;
        return;
    }

    if (!inputFecha || inputFecha.value === "") {
        selectHorario.innerHTML = '<option value="">Seleccione primero una fecha...</option>';
        selectHorario.disabled = true;
        return;
    }

    selectHorario.disabled = false;
    selectHorario.innerHTML = '<option value="">Seleccione una hora disponible...</option>';

    const listaHorariosBase = ["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];
    const citasAgendadas = JSON.parse(localStorage.getItem('citas_locales')) || [];

    const horasOcupadas = citasAgendadas
        .filter(cita => cita.centro_medico === centroGuardado.nombre && cita.fecha_cita === inputFecha.value)
        .map(cita => cita.hora);

    let horasDisponiblesContador = 0;
    listaHorariosBase.forEach(hora => {
        const opcion = document.createElement('option');
        opcion.value = hora;
        
        if (horasOcupadas.includes(hora)) {
            opcion.textContent = `${hora} (Ocupado 🚫)`;
            opcion.disabled = true;
        } else {
            opcion.textContent = `${hora} (Disponible ✔)`;
            horasDisponiblesContador++;
        }
        selectHorario.appendChild(opcion);
    });

    if (horasDisponiblesContador === 0) {
        selectHorario.innerHTML = '<option value="">⚠️ No hay horarios libres para este día</option>';
        selectHorario.disabled = true;
    }
}

function mostrarCentroPreseleccionado() {
    const contenedorResumen = document.getElementById('resumen-cita-seleccionada');
    if (!contenedorResumen) return;

    const centroGuardado = JSON.parse(localStorage.getItem('centro_seleccionado_temp'));
    if (centroGuardado) {
        contenedorResumen.style.display = 'block';
        contenedorResumen.style.background = '#eff6ff';
        contenedorResumen.style.color = '#1e40af';
        contenedorResumen.textContent = `Centro Médico Seleccionado: ${centroGuardado.nombre} (${centroGuardado.tipo})`;
    } else {
        contenedorResumen.style.display = 'block';
        contenedorResumen.style.background = '#fef3c7';
        contenedorResumen.style.color = '#b45309';
        contenedorResumen.textContent = "Atención: Debe seleccionar un centro médico desde la pestaña de búsqueda para gestionar los horarios.";
    }
}

function validarHorarioRealTime() {
    const input = document.getElementById('horario-cita');
    const error = document.getElementById('error-horario');
    if (!input || !error || input.disabled) return false;

    if (input.value === "") {
        error.textContent = "Debe seleccionar una hora para su atención médica.";
        input.className = "form-control invalid";
        return false;
    } else {
        error.textContent = "";
        input.className = "form-control valid";
        return true;
    }
}

function validarFechaRealTime() {
    const input = document.getElementById('fecha-cita');
    const error = document.getElementById('error-fecha');
    if (!input || !error) return false;

    if (input.value === "") {
        error.textContent = "Debe seleccionar una fecha para su cita.";
        input.className = "form-control invalid";
        return false;
    } else {
        error.textContent = "";
        input.className = "form-control valid";
        return true;
    }
}

function validarNombreRealTime() {
    const input = document.getElementById('nombre-completo');
    const error = document.getElementById('error-nombre');
    if (!input || !error) return false;
    if (input.value.trim().length < 6) {
        error.textContent = "Debe introducir nombre y apellidos completos.";
        input.className = "form-control invalid";
        return false;
    } else {
        error.textContent = "";
        input.className = "form-control valid";
        return true;
    }
}

function validarCedulaRealTime() {
    const input = document.getElementById('cedula-usuario');
    const error = document.getElementById('error-cedula');
    const formatoCedula = /^[0-9]{9}$/;
    if (!input || !error) return false;
    if (!formatoCedula.test(input.value.trim())) {
        error.textContent = "Ingrese exactamente 9 dígitos numéricos.";
        input.className = "form-control invalid";
        return false;
    } else {
        error.textContent = "";
        input.className = "form-control valid";
        return true;
    }
}

function validarMotivoRealTime() {
    const input = document.getElementById('motivo-consulta');
    const error = document.getElementById('error-motivo');
    if (!input || !error) return false;
    if (input.value.trim().length < 15) {
        error.textContent = "Detalle con mayor claridad (mínimo 15 caracteres).";
        input.className = "form-control invalid";
        return false;
    } else {
        error.textContent = "";
        input.className = "form-control valid";
        return true;
    }
}

function limpiarClasesValidacion() {
    document.getElementById('nombre-completo').className = "form-control";
    document.getElementById('cedula-usuario').className = "form-control";
    document.getElementById('motivo-consulta').className = "form-control";
    if (document.getElementById('fecha-cita')) document.getElementById('fecha-cita').className = "form-control";
    if (document.getElementById('horario-cita')) document.getElementById('horario-cita').className = "form-control";
}

function mostrarMensajeExito(textoMensaje) {
    let bannerExistente = document.querySelector('.alert-success-banner');
    if (bannerExistente) bannerExistente.remove();

    const banner = document.createElement('div');
    banner.className = 'alert-success-banner';
    banner.textContent = textoMensaje;

    const mainContenedor = document.querySelector('main');
    if (mainContenedor) {
        mainContenedor.insertBefore(banner, mainContenedor.firstChild);
        setTimeout(() => {
            banner.remove();
        }, 4000);
    }
}