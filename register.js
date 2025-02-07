document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    // Réinitialiser le message
    messageDiv.textContent = '';
    messageDiv.className = '';

    const data = { username, password };

    try {
        const response = await fetch('http://88.160.251.130:1211/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            messageDiv.textContent = 'Utilisateur créé avec succès !';
            messageDiv.className = 'success';

            // Rediriger vers la page de connexion après 2 secondes
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            const error = await response.json();
            messageDiv.textContent = error.message || 'Une erreur est survenue. Veuillez réessayer.';
            messageDiv.className = 'error';
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
        messageDiv.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        messageDiv.className = 'error';
    }
});
