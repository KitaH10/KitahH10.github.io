document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-login');
    const inputCedula = document.getElementById('cedula-login');
    const errorLogin = document.getElementById('error-login');

    const padronAsegurados = [
        {
            "id": 1,
            "cedula": "703150858",
            "nombre_completo": "Carlos Iker Paniagua Molina",
            "correo": "carpani011@gmail.com",
            "telefono": "8712-1234",
            "estado_asegurado": "Activo"
        },
        {
            "id": 2,
            "cedula": "203450678",
            "nombre_completo": "María Elena Rojas Castillo",
            "correo": "maria.rojas@correo.cr",
            "telefono": "8777-2222",
            "estado_asegurado": "Activo"
        },
        {
            "id": 3,
            "cedula": "305670891",
            "nombre_completo": "Luis Fernando Solano Arce",
            "correo": "luis.solano@correo.cr",
            "telefono": "8666-3333",
            "estado_asegurado": "Inactivo"
        },
        {
            "id": 4,
            "cedula": "401110222",
            "nombre_completo": "Ana Lucía Valverde Quirós",
            "correo": "ana.valverde@correo.cr",
            "telefono": "8555-4444",
            "estado_asegurado": "Activo"
        },
        {
            "id": 5,
            "cedula": "502220333",
            "nombre_completo": "Carlos Manuel Delgado Mena",
            "correo": "carlos.delgado@correo.cr",
            "telefono": "8444-5555",
            "estado_asegurado": "Activo"
        },
        {
            "id": 6,
            "cedula": "603330444",
            "nombre_completo": "Laura Vanessa Gómez Herrera",
            "correo": "laura.gomez@correo.cr",
            "telefono": "8333-6666",
            "estado_asegurado": "Activo"
        },
        {
            "id": 7,
            "cedula": "704440555",
            "nombre_completo": "Jorge Arturo Jiménez Chaves",
            "correo": "jorge.jimenez@correo.cr",
            "telefono": "8222-7777",
            "estado_asegurado": "Inactivo"
        },
        {
            "id": 8,
            "cedula": "805550666",
            "nombre_completo": "Sofía Isabel Brenes Aguilar",
            "correo": "sofia.brenes@correo.cr",
            "telefono": "8111-8888",
            "estado_asegurado": "Activo"
        },
        {
            "id": 9,
            "cedula": "109870654",
            "nombre_completo": "Andrés Eduardo Castro Marín",
            "correo": "andres.castro@correo.cr",
            "telefono": "7000-1111",
            "estado_asegurado": "Activo"
        },
        {
            "id": 10,
            "cedula": "208760543",
            "nombre_completo": "Elena María Vargas Fonseca",
            "correo": "elena.vargas@correo.cr",
            "telefono": "7111-2222",
            "estado_asegurado": "Activo"
        }
    ];

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            const cedulaTexto = inputCedula.value.trim();

            if (!/^[0-9]{9}$/.test(cedulaTexto)) {
                errorLogin.textContent = "Ingrese una cédula válida de 9 dígitos.";
                inputCedula.className = "form-control invalid";
                return;
            }

            const usuarioEncontrado = padronAsegurados.find(u => u.cedula === cedulaTexto);

            if (!usuarioEncontrado) {
                errorLogin.textContent = "La cédula no se encuentra registrada en la base de datos de la CCSS.";
                inputCedula.className = "form-control invalid";
            } else if (usuarioEncontrado.estado_asegurado !== "Activo") {
                errorLogin.textContent = "Acceso Denegado: Su seguro de salud no se encuentra al día.";
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