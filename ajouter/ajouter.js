async function chargerListeMateriels() {
    const select = document.getElementById('delete-material');

    try {
        const response = await fetch('http://88.160.251.130:1211/materiels');
        const materiels = await response.json();

        materiels.forEach(item => {
            const option = document.createElement('option');
            option.value = item.Nom;
            option.textContent = item.Nom;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Erreur lors du chargement des matériels :', err);
    }
}

window.onload = () => {
    chargerListeMateriels();
};


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

document.getElementById('delete-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const materialName = document.getElementById('delete-material').value;
    const messageDiv = document.getElementById('message');

    const userId = localStorage.getItem('userId');
    const userToken = localStorage.getItem('userToken');

    if (!userId || !userToken) {
        window.location.href = '/index.html';
        return;
    }

    messageDiv.textContent = '';
    messageDiv.className = '';

    if (!materialName) {
        messageDiv.textContent = 'Veuillez saisir un nom de matériel à supprimer.';
        messageDiv.className = 'error';
        return;
    }

    try {
        const response = await fetch(`http://88.160.251.130:1211/supprimer/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ materielle: materialName }),
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = 'Matériel supprimé avec succès.';
            messageDiv.className = 'success';

            const select = document.getElementById('delete-material');
            select.innerHTML = '<option value="">-- Sélectionnez un matériel --</option>';
            chargerListeMateriels();
        } else {
            messageDiv.textContent = result.message || 'Erreur lors de la suppression.';
            messageDiv.className = 'error';
        }
    } catch (err) {
        console.error('Erreur lors de la suppression :', err);
        messageDiv.textContent = 'Erreur réseau, veuillez réessayer.';
        messageDiv.className = 'error';
    }
});