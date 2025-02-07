document.getElementById('emprunt-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const material = document.getElementById('material').value;
    const date = document.getElementById('date').value;
    const messageDiv = document.getElementById('message');

    // On récupère l'ID utilisateur à partir du token
    const userId = localStorage.getItem('userId'); // Assurez-vous de stocker l'ID utilisateur lors de la connexion

    if (!userId) {
        window.location.href = '/index.html';
        return;
    }

    // Réinitialiser le message
    messageDiv.textContent = '';
    messageDiv.className = '';

    if (!material || !date) {
        messageDiv.textContent = 'Veuillez sélectionner un matériel et une date.';
        messageDiv.className = 'error';
        return;
    }

    
    // Construire le JSON avec id_user, materiel_emprunte et date_emprunt
    const data = {
        id_user: userId,  // Assurez-vous que l'ID utilisateur est stocké dans le localStorage lors de la connexion
        materielle: material,  // matériel emprunté en tant que varchar
        date_emprunt: date  // Date en varchar
    };

    try {
        const response = await fetch('http://88.160.251.130:1211/emprunt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            messageDiv.textContent = 'Emprunt effectué avec succès !';
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
