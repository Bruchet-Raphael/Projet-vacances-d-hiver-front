document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Réinitialiser le message d'erreur
    errorMessage.textContent = '';

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
            alert('Utilisateur créé avec succès');
            // Vous pouvez rediriger l'utilisateur vers une page de connexion ou autre
            window.location.href = '/login.html'; // Exemple de redirection
        } else {
            const error = await response.json();
            errorMessage.textContent = error.message || 'Une erreur est survenue. Veuillez réessayer.';
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
    }
});