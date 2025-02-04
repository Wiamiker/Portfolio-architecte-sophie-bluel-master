let works = [];
let btnModifier = document.querySelector(".btn-modifier");
let addButton = document.querySelector(".addbutton");
let modalAjout = document.querySelector(".modal_ajout");
let modalGallery = document.querySelector(".modal_gallery");

addButton.addEventListener("click", function(event) {
    modalAjout.classList.remove("hiden");
    modalGallery.classList.add("hiden");
});

if (localStorage.getItem("token")) {
    let login = document.getElementById('login');
    login.innerHTML = "Logout";
    login.classList.add("logout");
    login.addEventListener("click", function(event) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
    masquerCategories();
} else {
    btnModifier.remove();
}

// Cacher les catégories
function masquerCategories() {
    var categories = document.querySelector(".filter-links");
    if (categories) {
        categories.style.display = "none";
    }
}

function openModal() {
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.modal').classList.add('modal--open');
    modalAjout.classList.add("hiden");
    modalGallery.classList.remove("hiden");
}

function closeModal() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.modal').classList.remove('modal--open');
}

// Récupération des catégories
fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        const filterLinksContainer = document.querySelector('.filter-links');
        const selectcategory = document.querySelector("#selectcategories");
        data.forEach(category => {
            const link = document.createElement('a');
            link.classList.add('filter-link');
            link.dataset.category = category.id;
            link.textContent = category.name;
            link.href = '#';

            let option = document.createElement("option");
            option.value = category.id;
            option.innerHTML = category.name;
            selectcategory.appendChild(option);

            filterLinksContainer.appendChild(link);
        });

        // Lecture des clics sur catégories
        const filterLinks = document.querySelectorAll('.filter-link');
        filterLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                filterLinks.forEach(lnk => lnk.classList.remove('active'));
                this.classList.add('active');
                let category = this.dataset.category;
                let resultatFiltre = works;

                if (category != undefined) {
                    resultatFiltre = works.filter((work) => work.categoryId == category);
                }
                getProjects(resultatFiltre);
            });
        });
    });

    const ajoutImage = document.getElementById("ajoutimage");
    const inputFile = document.getElementById('fileInput');
    const faImage = document.querySelector('.fa-image');
    const texteImage = document.querySelector('.formatting p'); // Sélection du <p> sans classe

    ajoutImage.addEventListener('click', function(event) {
        event.preventDefault();
        inputFile.click();

    })

    inputFile.addEventListener('change', (event) => {
        const fichier = event.target.files[0];

        if (fichier) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Crée une balise <img> pour afficher l'image
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result; // Utilise le résultat du FileReader
                imgElement.style.maxWidth = '100px'; // Limite la taille de l'image (vous pouvez ajuster)
                imgElement.style.borderRadius = '5px'; // Pour donner un aspect esthétique
                console.log()

                // Remplace le bouton par l'image
                const formattingDiv = document.querySelector('.formatting');
                formattingDiv.replaceChild(imgElement, ajoutImage); // Remplace le bouton par l'image
                console.log()

                // Masque l'icône et le paragraphe
                faImage.style.display = 'none';
                texteImage.style.display = 'none';
            };

           reader.readAsDataURL(fichier); // Lit le fichier en tant qu'URL de données
        }
    });

    

// Événement pour ajouter un projet
const validButton = document.querySelector(".valid_button");

// Empêcher la redirection lors de l'envoi
validButton.addEventListener('click', function(event) {
    event.preventDefault(); // Empêche la redirection

    const inputImage = document.querySelector("#fileInput");
    const nom = document.querySelector("#nomimage");
    const categories = document.querySelector("#selectcategories");
    
    const formData = new FormData();
    
    formData.append('image', inputImage.files[0]);
    formData.append('title', nom.value);
    formData.append('category', categories.value);

    let token = localStorage.getItem("token");
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du projet');
        }
        return response.json();
    })
    .then(data => {
        works.push(data); // Ajouter le nouveau projet à la liste
        //getProjects(works); // Rafraîchir l'affichage
        closeModal(); // Fermer la modal
        
        // Réinitialiser le formulaire après ajout
        document.querySelector(".ajout").reset(); // Réinitialiser le formulaire
        
        updateHomeProjects(data); // Mettre à jour l'affichage sur la page d'accueil
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
});

// Récupération des projets
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        works = data;
        getProjects(data);
        closeModal();
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
    });

// Fonction pour afficher les projets
function getProjects(projects) {
    const gallery = document.querySelector('.gallery');
    const galleryModal = document.querySelector(".gallery-modal");
    gallery.innerHTML = "";
    galleryModal.innerHTML = ""; // Effacer le contenu de la modal avant d'ajouter de nouveaux projets

    projects.forEach(project => {
        // Portfolio Gallery
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        image.src = project.imageUrl;
        image.alt = project.title;
        figcaption.textContent = project.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
        
    })}