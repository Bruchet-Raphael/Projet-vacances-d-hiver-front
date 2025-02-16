document.addEventListener("DOMContentLoaded", async function () {
    const userId = localStorage.getItem("userId"); // Récupérer l'ID utilisateur stocké
    const messageDiv = document.getElementById("message");
    const empruntList = document.getElementById("emprunt-list");

    // Vérifier si l'utilisateur est connecté
    if (!userId) {
        window.location.href = '/index.html';
        return;
    }

    try {
        // Requête pour récupérer les emprunts
        const response = await fetch(`http://88.160.251.130:1211/emprunt/${userId}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des emprunts.");
        }

        const emprunts = await response.json();

        // Vider la liste avant d'ajouter les nouveaux éléments
        empruntList.innerHTML = "";

        if (emprunts.length === 0) {
            messageDiv.textContent = "Aucun emprunt trouvé.";
            messageDiv.className = "info";
            return;
        }

    // Afficher les emprunts dans le tableau
       
    emprunts.forEach(emprunt => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${emprunt.id}</td>
            <td>${emprunt.username || "N/A"}</td>
            <td>${emprunt.materielle}</td>
            <td>${new Date(emprunt.date_emprunt).toLocaleDateString()}</td>
            <td>
                <button class="delete-btn" data-id="${emprunt.id}">Supprimer</button>
            </td>
        `;
        empruntList.appendChild(tr);
});


        // Ajouter des gestionnaires d'événements pour les boutons "Supprimer"
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const empruntId = e.target.getAttribute("data-id");

                try {
                    const deleteResponse = await fetch(`http://88.160.251.130:1211/emprunt/${empruntId}`, {
                        method: "DELETE",
                    });

                    if (!deleteResponse.ok) {
                        throw new Error("Erreur lors de la suppression de l'emprunt.");
                    }

                    // Supprimer la ligne du tableau après suppression
                    e.target.closest("tr").remove();
                    messageDiv.textContent = "Emprunt supprimé avec succès.";
                    messageDiv.className = "success";
                } catch (error) {
                    messageDiv.textContent = error.message;
                    messageDiv.className = "error";
                }
            });
        });

        messageDiv.textContent = ""; // Réinitialiser les messages
    } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.className = "error";
    }
});
