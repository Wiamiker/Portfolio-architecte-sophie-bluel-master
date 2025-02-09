const password=document.querySelector("#user-password");
const email=document.querySelector("#user-email");
const submit=document.querySelector("#auth-submit");
const errorMessage = document.querySelector("#error-message"); // Sélection du message d'erreur

submit.addEventListener("click",async(e)=> {
    e.preventDefault();
    var data = {
        email: email.value,
        password: password.value,
    };

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error("Adresse mail ou mot de passe invalide");
            } else {
                throw new Error("Erreur lors de la connexion");
            }
        })

        .then(function (responseData) {
            var token = responseData.token;
            localStorage.setItem("token", token);
            localStorage.setItem("userId",responseData.userId)
            console.log(responseData)
            window.location.href = "index.html";
        })
        
         .catch(function (error) {
            errorMessage.textContent = error.message; // Afficher le message d'erreur
            errorMessage.style.display = "block"; // Rendre le message visible
        });

        //.catch(error => {
          //  errorMessage.textContent = error.message; // Afficher le message d'erreur
            //errorMessage.style.display = "block"; // Rendre le message visible
        //});

})