document.addEventListener("DOMContentLoaded", async function () {
    const userId = localStorage.getItem("userId");
    const messageDiv = document.getElementById("message");
    const empruntList = document.getElementById("emprunt-list");
    const tableHead = document.getElementById("table-head");

    if (!userId) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch(`http://88.160.251.130:1211/emprunt/${userId}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des emprunts.");
        }

        const emprunts = await response.json();

        empruntList.innerHTML = "";
        messageDiv.textContent = "";

        if (emprunts.length === 0) {
            messageDiv.className = "info";
            return;
        }

        const hasUsername = emprunts.some(e => e.username);

        // Génération des en-têtes dynamiquement
        tableHead.innerHTML = `
            <th>ID</th>
            ${hasUsername ? "<th>Nom d'utilisateur</th>" : ""}
            <th>Matériel</th>
            <th>Date d'emprunt</th>
            ${hasUsername ? "<th>Action</th>" : ""}
        `;

        emprunts.forEach(emprunt => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emprunt.id}</td>
                ${hasUsername ? `<td>${emprunt.username}</td>` : ""}
                <td>${emprunt.nom_materiel}</td>
                <td>${new Date(emprunt.date_emprunt).toLocaleDateString()}</td>
                ${hasUsername ? `
                    <td>
                        <button class="delete-btn" data-id="${emprunt.id}">Supprimer</button>
                    </td>
                ` : ""}
            `;
            empruntList.appendChild(tr);
        });

        // Ajouter des gestionnaires d'événements pour les boutons "Supprimer"
        if (hasUsername) {
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async (e) => {
                    const empruntId = e.target.getAttribute("data-id");

                    try {
                        const deleteResponse = await fetch(`http://88.160.251.130:1211/emprunt/${empruntId}/${userId}`, {
                            method: "DELETE",
                        });

                        const result = await deleteResponse.json();

                        if (!deleteResponse.ok) {
                            throw new Error(result.message || "Erreur lors de la suppression.");
                        }

                        // Supprimer la ligne du tableau
                        e.target.closest("tr").remove();
                        messageDiv.textContent = "Emprunt supprimé avec succès.";
                        messageDiv.className = "success";
                    } catch (error) {
                        messageDiv.textContent = error.message;
                        messageDiv.className = "error";
                    }
                });
            });
        }

    } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.className = "error";
    }
});
