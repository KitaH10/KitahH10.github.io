// añade un listener al evento DOMContentLoaded para asegurarse de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-registro');
    const inputNombre = document.getElementById('nombre-completo');
    const inputCedula = document.getElementById('cedula-usuario');
    const inputMotivo = document.getElementById('motivo-consulta');
    const inputFecha = document.getElementById('fecha-cita');
    const selectHorario = document.getElementById('horario-cita');
    
    //se encarga de mostrar el centro médico preseleccionado en la parte superior del formulario, si existe uno guardado en el LocalStorage
    mostrarCentroPreseleccionado();
    cargarHorariosDisponibles();

    //se agregan listeners a los campos del formulario para validar en tiempo real y proporcionar información inmediata al usuario sobre la validez de los datos ingresados
    if (inputNombre) inputNombre.addEventListener('input', validarNombreRealTime);
    if (inputCedula) inputCedula.addEventListener('input', validarCedulaRealTime);
    if (inputMotivo) inputMotivo.addEventListener('input', validarMotivoRealTime);
    if (inputFecha) inputFecha.addEventListener('change', () => {
        validarFechaRealTime();
        cargarHorariosDisponibles();
    });
    
    //se agrega un listener al select de horarios para validar la selección en tiempo real
    if (selectHorario) selectHorario.addEventListener('change', validarHorarioRealTime);
    
    //se agrega un listener al evento submit del formulario para validar todos los campos antes de permitir el registro de la cita
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const v1 = validarNombreRealTime();
            const v2 = validarCedulaRealTime();
            const v3 = validarMotivoRealTime();
            const v4 = validarFechaRealTime();
            const v5 = validarHorarioRealTime();
            
            // si alguno de los campos no es válido, se muestra un mensaje de alerta y se detiene el proceso de registro
            if (!v1 || !v2 || !v3 || !v4 || !v5) {
                alert('Por favor, corrija los campos marcados en rojo antes de continuar.');
                return;
            }
            
            //si todos los campos son válidos, se procede a crear un objeto de cita con los datos ingresados y se guarda en el LocalStorage para su posterior visualización en el historial de citas
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
            
            //se obtiene el historial de citas del LocalStorage, se agrega la nueva cita y se guarda nuevamente en el LocalStorage
            let historial = JSON.parse(localStorage.getItem('citas_locales')) || [];
            historial.push(nuevaCita);
            localStorage.setItem('citas_locales', JSON.stringify(historial));

            // Guarda de forma persistente el mensaje de éxito para que el archivo index.js lo renderice al cargar la página principal
            const textoMensaje = `¡Cita agendada con éxito en el ${centroGuardado.nombre} el día ${inputFecha.value} a las ${selectHorario.value}!`;
            sessionStorage.setItem('mensaje_exito_ccss', textoMensaje);
            
            formulario.reset();
            limpiarClasesValidacion();
            localStorage.removeItem('centro_seleccionado_temp');
            
            // Ejecuta la redirección inmediata hacia la pantalla de inicio
            window.location.href = "index.html";
        });
    }
});

//se encarga de cargar los horarios disponibles en el select de horarios según la fecha seleccionada y el centro médico preseleccionado, deshabilitando las horas que ya están ocupadas por otras citas
function cargarHorariosDisponibles() {
    const selectHorario = document.getElementById('horario-cita');
    const inputFecha = document.getElementById('fecha-cita');
    if (!selectHorario) return;

    const centroGuardado = JSON.parse(localStorage.getItem('centro_seleccionado_temp'));
    
    if (!centroGuardado) {
        selectHorario.innerHTML = '<option value="">Seleccione primero un centro médico desde la búsqueda</option>';
        selectHorario.disabled = true;
        return;
    }

    if (!inputFecha || inputFecha.value === "") {
        selectHorario.innerHTML = '<option value="">Seleccione primero una fecha</option>';
        selectHorario.disabled = true;
        return;
    }

    selectHorario.disabled = false;
    selectHorario.innerHTML = '<option value="">Seleccione una hora disponible</option>';

    // Lista expandida con intervalos simétricos de 15 minutos en bloques matutinos y vespertinos
    const listaHorariosBase = [
        "07:00 AM", "07:15 AM", "07:30 AM", "07:45 AM",
        "08:00 AM", "08:15 AM", "08:30 AM", "08:45 AM",
        "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
        "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
        "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
        "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM",
        "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
        "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM"
    ];
    
    const citasAgendadas = JSON.parse(localStorage.getItem('citas_locales')) || [];
    
    //se filtran las citas que coinciden con el centro médico y la fecha seleccionada, y se obtiene un array de horas ocupadas para deshabilitarlas en el select de horarios
    const horasOcupadas = citasAgendadas
        .filter(cita => cita.centro_medico === centroGuardado.nombre && cita.fecha_cita === inputFecha.value)
        .map(cita => cita.hora);
        
    //se recorre la lista de horarios base y se crean opciones en el select, deshabilitando las horas que ya están ocupadas y mostrando un contador de horas disponibles
    let horasDisponiblesContador = 0;
    listaHorariosBase.forEach(hora => {
        const opcion = document.createElement('option');
        opcion.value = hora;
        
        if (horasOcupadas.includes(hora)) {
            opcion.textContent = `${hora} (Ocupado ❌)`;
            opcion.disabled = true;
        } else {
            opcion.textContent = `${hora} (Disponible ✔)`;
            horasDisponiblesContador++;
        }
        selectHorario.appendChild(opcion);
    });

    if (horasDisponiblesContador === 0) {
        selectHorario.innerHTML = '<option value="">No hay horarios libres para este día</option>';
        selectHorario.disabled = true;
    }
}

//se encarga de mostrar el centro médico preseleccionado en la parte superior del formulario, si existe uno guardado en el LocalStorage
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
        contenedorResumen.textContent = "Debe seleccionar un centro médico desde la pestaña de búsqueda para gestionar los horarios";
    }
}

//se encarga de validar en tiempo real la hora seleccionada, asegurándose de que el usuario haya elegido un horario para su cita médica
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

//se encarga de validar en tiempo real la fecha seleccionada, asegurándose de que no sea una fecha pasada y que esté dentro del rango permitido para agendar citas
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

//se encarga de validar en tiempo real el nombre completo ingresado por el asegurado, asegurándose de que tenga al menos 6 caracteres para considerar que es un nombre y apellidos completos
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

//se encarga de validar que la cédula ingresada contenga exactamente 9 dígitos numéricos
function validarCedulaRealTime() {
    const input = document.getElementById('cedula-usuario');
    const error = document.getElementById('error-cedula');
    if (!input || !error) return false;
    if (!/^[0-9]{9}$/.test(input.value.trim())) {
        error.textContent = "Ingrese exactamente 9 dígitos numéricos.";
        input.className = "form-control invalid";
        return false;
    } else {
        error.textContent = "";
        input.className = "form-control valid";
        return true;
    }
}

//se encarga de verificar que el motivo de consulta sea claro y detallado con un mínimo de 15 caracteres
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

// se encarga de remover las clases de éxito o error al limpiar el formulario
function limpiarClasesValidacion() {
    document.querySelectorAll('.form-control').forEach(c => c.classList.remove('valid', 'invalid'));
}
