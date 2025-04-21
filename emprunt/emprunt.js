document.addEventListener('DOMContentLoaded', async function () {
    const materialSelect = document.getElementById('material');
    const dateInput = document.getElementById('date');

    // Afficher la date d’aujourd’hui (mais ne pas l'envoyer)
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    try {
        const response = await fetch('http://88.160.251.130:1211/materiels');
        if (!response.ok) throw new Error("Erreur lors du chargement des matériels");
        
        const materiels = await response.json();
        materiels.forEach(mat => {
            const option = document.createElement('option');
            option.value = mat.id;
            option.textContent = mat.Nom;
            materialSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur de chargement des matériels :', error);
        alert('Impossible de charger les matériels disponibles.');
    }
});

document.getElementById('emprunt-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const material = document.getElementById('material').value;
    const messageDiv = document.getElementById('message');
    const userId = localStorage.getItem('userId');

    if (!userId) {
        window.location.href = '/index.html';
        return;
    }

    messageDiv.textContent = '';
    messageDiv.className = '';

    if (!material) {
        messageDiv.textContent = 'Veuillez sélectionner un matériel.';
        messageDiv.className = 'error';
        return;
    }

    const data = {
        id_user: userId,
        materielle: material
        // date_emprunt n'est PAS envoyé ici
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
