let works=[]
let btnModifier=document.querySelector(".btn-modifier");
let addButton=document.querySelector(".addbutton");
let modalAjout=document.querySelector(".modal_ajout");
let modalGallery=document.querySelector(".modal_gallery");

addButton.addEventListener("click", function(event){
		modalAjout.classList.remove("hiden")
		modalGallery.classList.add("hiden")
})

if(localStorage.getItem("token")) {
    let login=document.getElementById('login')
    login.innerHTML="Logout"
    login.classList.add("logout")
    login.addEventListener("click",function(event){
        localStorage.removeItem("token")
        window.location.href="index.html"
    }

)
masquerCategories();
}

		else {
			btnModifier.remove();
		}

// coder ici pour faire disparaitre les catégories 
function masquerCategories() {
	var categories = document.querySelector(".filter-links");
	if (categories) {
	  categories.style.display = "none";
	}
  }

  function openModal() {
	document.querySelector('.overlay').style.display = 'block';
	document.querySelector('.modal').classList.add ('modal--open');
}

function closeModal() {
	document.querySelector('.overlay').style.display = 'none';
	document.querySelector('.modal').classList.remove ('modal--open');
}
  



// Récupération des catégories
fetch('http://localhost:5678/api/categories')
.then(response => response.json())
.then(data => {
const filterLinksContainer = document.querySelector('.filter-links');
const selectcategory =document.querySelector("#selectcategories");
data.forEach(category => {

const link = document.createElement('a');
link.classList.add('filter-link');
link.dataset.category=category.id;
link.textContent = category.name;
link.href = '#';

let option=document.createElement("option");
option.value=category.id;
option.innerHTML=category.name;
selectcategory.appendChild(option);

filterLinksContainer.appendChild(link)
});


    // Lecture des clics sur catégories 

    const filterLinks = document.querySelectorAll('.filter-link');

		filterLinks.forEach(link => {
			link.addEventListener('click', function (event) {
                console.log(link);
				event.preventDefault();
				filterLinks.forEach(lnk => lnk.classList.remove('active'));
				this.classList.add('active');
                let category=this.dataset.category;
                console.log(category)
                
                    let resultatFiltre=works
                
                if(category!=undefined){ 
                    resultatFiltre= works.filter((work) => work.categoryId == category); 
                }
                console.log(resultatFiltre);
                getProjects(resultatFiltre)
			});
		});
})

const validButton=document.querySelector(".valid_button");

validButton.addEventListener('click', function(event){
	let image=document.querySelector("#ajoutimage");
	let nom=document.querySelector("#nomimage");
	let categories=document.querySelector("#selectcategories");
	console.log(image,nom,categories);

	event.preventDefault();
	let token=localStorage.getItem("token");
	const formData = new FormData();
	console.log(token);

	formData.append('image', image.files[0]);
	formData.append('title', nom.value);
	formData.append('category', categories.value);
	console.log(formData);


	fetch('http://localhost:5678/api/works', {

		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`
		},
		body: formData
	})
})

// Récupération des projets 

fetch('http://localhost:5678/api/works')
	.then(response => response.json())
	.then(data => {
		
        works=data;

        getProjects(data)

		
	})
	.catch(error => {
		console.error('Erreur lors de la récupération des données:', error);
	});

    function getProjects(projects){
        const gallery = document.querySelector('.gallery');
		const galleryModal=document.querySelector(".gallery-modal");
        gallery.innerHTML="";
        projects.forEach(project => {

			// Portfolio Gallery
			const figure = document.createElement('figure');
			const image = document.createElement('img');
			const figcaption = document.createElement('figcaption');
			
			const trash = document.createElement('div');
			trash.classList.add('trash');
			trash.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

			figure.dataset.category = project.categoryId;
			figure.appendChild(trash)
			figure.dataset.projectId = project.id;

			image.src = project.imageUrl;
			image.alt = project.title;
			figcaption.textContent = project.title;

			figure.appendChild(image);
			figure.appendChild(figcaption);
			let item=figure.cloneNode(true);
			gallery.appendChild(figure);
			//ajouter appenchild(poubelle)
			//galleryModal.appendChild(trash);
			//image.appendChild(trash);
			galleryModal.appendChild(item);
		});
    }