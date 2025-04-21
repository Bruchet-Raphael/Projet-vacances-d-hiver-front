document.getElementById('emprunt-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const material = document.getElementById('material').value;
    const messageDiv = document.getElementById('message');

    const userId = localStorage.getItem('userId');
    const userToken = localStorage.getItem('userToken');

    if (!userId || !userToken) {
        window.location.href = '/index.html';
        return;
    }

    messageDiv.textContent = '';
    messageDiv.className = '';

    if (!material) {
        messageDiv.textContent = 'Veuillez saisir un matériel.';
        messageDiv.className = 'error';
        return;
    }

    const data = {
        materielle: material,
    };

    try {
        const response = await fetch(`http://88.160.251.130:1211/ajouter/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            messageDiv.textContent = 'Matériel ajouté avec succès !';
            messageDiv.className = 'success';
        } else {
            const error = await response.json();
            messageDiv.textContent = error.message || 'Une erreur est survenue, veuillez réessayer.';
            messageDiv.className = 'error';
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
        messageDiv.textContent = 'Une erreur est survenue, veuillez réessayer.';
        messageDiv.className = 'error';
    }
});
