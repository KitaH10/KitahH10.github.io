document.addEventListener('DOMContentLoaded', () => {
    const sesion = JSON.parse(localStorage.getItem('sesion_ccss'));//lee la sesión guardada por login.js en el LocalStorage
    //si no hay sesión activa, redirige al login para evitar acceso no autorizado
    if (!sesion || !sesion.activo) {
        window.location.href = "login.html";
        return;
    }
    //busca el menú de navegación para agregar opciones globales como modo oscuro y cerrar sesión
    const navUl = document.querySelector('nav ul');
    if (navUl) {
       //crea y añade el botón de modo oscuro al menú de navegación
        const liDark = document.createElement('li');
        liDark.innerHTML = `<button id="btn-dark-toggle" class="btn-toggle-dark">🌙 Modo</button>`;
        navUl.appendChild(liDark);

       //crea y añade el botón de cerrar sesión al menú de navegación, mostrando el primer nombre del usuario
        const liCerrarSesion = document.createElement('li');
        liCerrarSesion.innerHTML = `<a href="#" id="btn-cerrar-sesion" style="color: var(--error-red);">Salir (${sesion.usuario.split(' ')[0]})</a>`;
        navUl.appendChild(liCerrarSesion);

        //registra un listener para el botón de cerrar sesión, que solicita confirmación antes de eliminar la sesión del LocalStorage y redirigir al login
        document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Desea cerrar su sesión?')) {
                localStorage.removeItem('sesion_ccss');
                window.location.href = "login.html";
            }
        });

        //se encarga de manejar el modo oscuro, revisando si estaba activo en la sesión anterior y aplicando la clase correspondiente, además de guardar la preferencia en el LocalStorage
        const btnDark = document.getElementById('btn-dark-toggle');
        //si el modo oscuro estaba activo en la sesión anterior, se aplica la clase dark-mode al body y se cambia el texto del botón
        if (localStorage.getItem('modo_oscuro') === 'activo') {
            document.body.classList.add('dark-mode');
            btnDark.textContent = '☀️ Modo';
        }
        //se agrega un listener al botón de modo oscuro para alternar la clase dark-mode en el body y guardar la preferencia en el LocalStorage
        btnDark.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('modo_oscuro', 'activo');
                btnDark.textContent = '☀️ Modo';
            } else {
                localStorage.setItem('modo_oscuro', 'inactivo');
                btnDark.textContent = '🌙 Modo';
            }
        });
    }
});