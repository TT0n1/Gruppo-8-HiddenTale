document.addEventListener("DOMContentLoaded", function() {
    // Specifica il percorso del file contenente l'HTML della navbar
    fetch('../HTML/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nel caricamento della navbar");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;

            // --- CONTROLLO SESSIONE UTENTE ---
            // Intercettiamo il tag <a> dell'account tramite la sua classe
            const accountLink = document.querySelector('.nav-item.account');

            if (accountLink) {
                accountLink.addEventListener('click', function(e) {
                    e.preventDefault(); // Blocca l'apertura immediata di account.html

                    // Verifica se esiste un utente memorizzato in sessionStorage o localStorage
                    const utenteLoggato = JSON.parse(sessionStorage.getItem('utenteLoggato')) || 
                                          JSON.parse(localStorage.getItem('utenteLoggato'));

                    if (utenteLoggato) {
                        // Se l'utente è loggato, procede verso la pagina dell'account
                        window.location.href = 'account.html';
                    } else {
                        // Se non è loggato, reindirizza alla pagina di login
                        window.location.href = 'login.html';
                    }
                });
            }
        })
        .catch(error => {
            console.error("Errore:", error);
        });
});