async function accessRestrictedArea() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('No hay token disponible. Inicie sesión primero.');
        window.location.href = '/';
        return;
    }

    const response = await fetch('/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const text = await response.text();
        document.body.innerHTML = `<h1>${text}</h1>`;
    } else {
        alert('Acceso denegado');
        window.location.href = '/';
    }
}
accessRestrictedArea();