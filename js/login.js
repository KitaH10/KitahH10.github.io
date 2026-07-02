let Asegurados = [];

//añade un listener al evento DOMContentLoaded para asegurarse de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-login');
    const inputCedula = document.getElementById('cedula-login');
    const errorLogin = document.getElementById('error-login');
    //se encarga de precargar el JSON de asegurados desde un archivo externo y almacenarlo en la variable global Asegurados para su uso posterior en la validación del login
    fetch('../json/usuarios.json')
        .then(respuesta => respuesta.json())
        .then(datos => {
            Asegurados = datos;
        })
        .catch(error => {
            console.error('Error al precargar el JSON de asegurados:', error);
            errorLogin.textContent = "Ha ocurrido un error al cargar los datos del padrón de asegurados. Por favor, inténtelo más tarde.";
        });
    //si el formulario existe, se agrega un listener al evento submit para validar la cédula ingresada y manejar la sesión del usuario
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            const cedulaTexto = inputCedula.value.trim();
            //valida que la cédula ingresada tenga exactamente 9 dígitos, mostrando un mensaje de error si no cumple con el formato
            if (!/^[0-9]{9}$/.test(cedulaTexto)) {
                errorLogin.textContent = "Ingrese una cédula válida de 9 dígitos.";
                inputCedula.className = "form-control invalid";
                return;
            }

            const usuarioEncontrado = Asegurados.find(u => u.cedula === cedulaTexto);

            if (!usuarioEncontrado) {
                errorLogin.textContent = "La cédula no se encuentra registrada en la base de datos de la CCSS";
                inputCedula.className = "form-control invalid";
            } else if (usuarioEncontrado.estado_asegurado !== "Activo") {
                errorLogin.textContent = "Acceso Denegado: Su seguro de salud no se encuentra al día";
                inputCedula.className = "form-control invalid";
            } else {
                errorLogin.textContent = "";
                inputCedula.className = "form-control valid";
                
                localStorage.setItem('sesion_ccss', JSON.stringify({
                    usuario: usuarioEncontrado.nombre_completo,
                    cedula: usuarioEncontrado.cedula,
                    activo: true
                }));

                window.location.href = "index.html";
            }
        });
    }
});
