document.getElementById('change-password-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const newPassword = document.getElementById('new-password').value;
    const messageDiv = document.getElementById('message');

    const userId = localStorage.getItem('userId');

    if (!userId) {
        messageDiv.innerText = "Utilisateur non identifié. Veuillez vous reconnecter.";
        return;
    }

    try {
        const response = await fetch('http://88.160.251.130:1211/updateMdp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                password: newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.innerText = data.message;
            messageDiv.style.color = "green";
            setTimeout(() => {
                window.location.href = '/mes_emprunt/';
            }, 1000);
        } else {
            messageDiv.innerText = data.message;
            messageDiv.style.color = "red";
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        messageDiv.innerText = "Erreur de connexion au serveur.";
        messageDiv.style.color = "red";
    }
});
