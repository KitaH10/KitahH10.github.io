document.addEventListener('DOMContentLoaded', () => {
    const sesion = JSON.parse(localStorage.getItem('sesion_ccss'));

    if (!sesion || !sesion.activo) {
        window.location.href = "login.html";
        return;
    }

    const navUl = document.querySelector('nav ul');
    if (navUl) {
       
        const liDark = document.createElement('li');
        liDark.innerHTML = `<button id="btn-dark-toggle" class="btn-toggle-dark">🌙 Modo</button>`;
        navUl.appendChild(liDark);

       
        const liCerrarSesion = document.createElement('li');
        liCerrarSesion.innerHTML = `<a href="#" id="btn-cerrar-sesion" style="color: var(--error-red);">Salir (${sesion.usuario.split(' ')[0]})</a>`;
        navUl.appendChild(liCerrarSesion);

        
        document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Desea cerrar su sesión en el portal médico?')) {
                localStorage.removeItem('sesion_ccss');
                window.location.href = "login.html";
            }
        });

        
        const btnDark = document.getElementById('btn-dark-toggle');
        
        if (localStorage.getItem('modo_oscuro') === 'activo') {
            document.body.classList.add('dark-mode');
            btnDark.textContent = '☀️ Modo';
        }

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