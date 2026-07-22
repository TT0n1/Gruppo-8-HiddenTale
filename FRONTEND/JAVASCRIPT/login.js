document.addEventListener("DOMContentLoaded", function() {
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();

            // Recupera i valori inseriti dall'utente
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            // Verifica che i campi non siano vuoti
            if (!email || !password) {
                alert('Inserisci sia la password che l\'email!');
                return;
            }

            // Crea l'oggetto con le informazioni dell'utente loggato
            const utenteLoggato = {
                email: email,
                nome: email.split('@')[0], // Estrae il nome utente dalla prima parte dell'email
                dataLogin: new Date().toISOString()
            };

            // Salva lo stato di login nella sessione corrente del browser
            sessionStorage.setItem('utenteLoggato', JSON.stringify(utenteLoggato));

            // Reindirizza l'utente alla pagina degli itinerari dopo l'accesso
            window.location.href = 'index.html';
        });
    }
});