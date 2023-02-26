// Récupère les données de l'objet "cart" dans le LocalStorage pour obtenir un objet JavaScript
let tableauLocalStorage = getFromLocalStorage();

// Créer un tableau vide qui sera rempli avec les données des produits plus tard
let tableauResult = [];
loadData();

function loadData() {
  let counter = 0;
  tableauLocalStorage.forEach(element => {

    fetch(`http://localhost:3000/api/products/${element._id}`)
      .then(response => response.json())
      .then(product => {

        const article = {
          ...element,
          ...product
        };
        tableauResult.push(article);
        counter++;
        if (counter === tableauLocalStorage.length) {
          displayProducts();
        }
      })
      .catch((erreur) => {
        console.log(erreur);
        alert("Une erreur est survenue Veuillez contacter l'administrateur du site!!");
      });;


  });

}

//Affiche les produits du panier dans la page HTML
function createProduct(product) {

  const article = document.createElement("article");
  article.className = "cart__item";
  article.setAttribute("data-id", product._id);
  article.setAttribute("data-color", product.color);

  const cartItemImg = document.createElement("div");
  cartItemImg.className = "cart__item__img";

  const img = document.createElement("img");
  img.src = product.imageUrl;
  img.alt = product.altTxt;

  cartItemImg.appendChild(img);
  article.appendChild(cartItemImg);


  const cartItemContent = document.createElement("div");
  cartItemContent.className = "cart__item__content";

  const cartItemContentDescription = document.createElement("div");
  cartItemContentDescription.className = "cart__item__content__description";

  const h2Description = document.createElement("h2");
  h2Description.className = "cart__item__content__titlePrice";
  h2Description.textContent = product.name;
  cartItemContentDescription.appendChild(h2Description);

  const color = document.createElement("p");
  color.textContent = product.color;
  cartItemContentDescription.appendChild(color);

  const pContentPrice = document.createElement("p");
  pContentPrice.className = "cart__item__content__titlePrice";
  pContentPrice.textContent = product.price + ` €`;
  cartItemContentDescription.appendChild(pContentPrice);

  cartItemContent.appendChild(cartItemContentDescription);


  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.className = "cart__item__content__settings";

  //changement de la quantité
  const divContentSettingsQuantity = document.createElement("div");
  divContentSettingsQuantity.className = "cart__item__content__settings__quantity";

  const settingsQuantity = document.createElement("p");
  settingsQuantity.textContent = "Qté : ";
  divContentSettingsQuantity.appendChild(settingsQuantity);

  const inputSettingsQuantity = document.createElement("input");
  inputSettingsQuantity.className = "itemQuantity";
  inputSettingsQuantity.setAttribute("type", "number");
  inputSettingsQuantity.setAttribute("min", "1");
  inputSettingsQuantity.setAttribute("max", "100");
  inputSettingsQuantity.setAttribute("name", "itemQuantity");
  inputSettingsQuantity.setAttribute("value", product.quantite);
  inputSettingsQuantity.addEventListener("change", function (event) {
    const validQty = controleQte(parseInt(this.value));
    if (validQty) {
      let id = this.closest(".cart__item").dataset.id;
      let color = this.closest(".cart__item").dataset.color;
      changeQuantity(parseInt(this.value), id, color);
    }
    alert('Votre article a bien été mis à jour sur votre panier !');
    calculateTotaux();
  }
  );
  divContentSettingsQuantity.appendChild(inputSettingsQuantity);
  cartItemContentSettings.appendChild(divContentSettingsQuantity);

  //supprimer un produit
  const divContentSettingsDelete = document.createElement("div");
  divContentSettingsDelete.className = "cart__item__content__settings__delete"

  const pSettingsDelete = document.createElement("p");
  pSettingsDelete.className = "deleteItem";
  pSettingsDelete.textContent = 'Supprimer';
  pSettingsDelete.addEventListener("click", function (event) {

    let id = this.closest(".cart__item").dataset.id;
    let color = this.closest(".cart__item").dataset.color;
    removeFromCart(id, color);

    // Affiche un message de confirmation de la suppression du produit
    this.closest("#cart__items").removeChild(this.closest(".cart__item"));
    alert('Votre article a bien été supprimé de votre panier !');
    calculateTotaux();
  }
  );
  divContentSettingsDelete.appendChild(pSettingsDelete);


  cartItemContentSettings.appendChild(divContentSettingsDelete);
  cartItemContent.appendChild(cartItemContentSettings);

  article.appendChild(cartItemContent);
  return article;

}

function displayProducts() {

  const sectionCartItems = document.getElementById("cart__items");
  tableauResult.forEach(element => {
    console.log(element);
    const article = createProduct(element);
    sectionCartItems.appendChild(article);
  });

  calculateTotaux();
  gestionFormulaire();
}
//tester changement des produits dans le panier
function changeQuantity(newQty, id, color) {
  console.log(newQty, id, color);

  console.log(tableauResult);
  // Filtre les produits à conserver dans le panier et supprime le produit selectionné
  let elementToUpdateFromProducts = tableauResult.findIndex(
    (element) => element._id === id && element.color === color
  );
  console.log(elementToUpdateFromProducts);
  tableauResult[elementToUpdateFromProducts].quantite = newQty;

  let elementToUpdateFromLocalStorage = tableauLocalStorage.findIndex(
    (element) => element._id === id && element.color === color
  );
  tableauLocalStorage[elementToUpdateFromLocalStorage].quantite = newQty;
  //mise a jour du local Storage
  setLocalStorage(tableauLocalStorage);

}
//tester suppression des produits dans le panier 
function removeFromCart(id, color) {
  console.log(id, color);

  // Filtre les produits à conserver dans le panier et supprime le produit selectionné
  let elementToRemoveFromProducts = tableauResult.findIndex(
    (element) => element._id === id && element.color === color
  );
  tableauResult.splice(elementToRemoveFromProducts, 1);

  let elementToRemoveFromLocalStorage = tableauLocalStorage.findIndex(
    (element) => element._id === id && element.color === color
  );
  tableauLocalStorage.splice(elementToRemoveFromLocalStorage, 1);
  //mise a jour du local Storage
  setLocalStorage(tableauLocalStorage);

}


function calculateTotaux() {
  let totalQty = 0;
  let totalPrice = 0;
  tableauResult.forEach(element => {
    totalQty += element.quantite;
    totalPrice += element.quantite * parseFloat(element.price);
  });

  document.getElementById("totalQuantity").textContent = totalQty;
  document.getElementById("totalPrice").textContent = totalPrice;
}


function gestionFormulaire() {

   
// ************ Gestion du formulaire de commande ************
// Gestion de la validation des champs du formulaire
const form = document.querySelector('.cart__order__form');

form.firstName.addEventListener('change', () => {
  nameValid(form.firstName, "name");
});

form.lastName.addEventListener('change', () => {
  nameValid(form.lastName, "lastName");
});

form.address.addEventListener('change', () => {
  addressValid(form.address);
});

form.city.addEventListener('change', () => {
  cityValid(form.city);
});

form.email.addEventListener('change', () => {
  emailValid(form.email);
});

// Gestion de la soumission du formulaire

form.addEventListener('submit', e => {
    e.preventDefault();
    // Si le panier est valide, on vérifie si le formulaire est valide
    if(tableauLocalStorage.length > 0) {
        
        // Si le formulaire est valide, je crée un objet contact à partir des données
        // de celui-ci
        if(nameValid(form.firstName) && nameValid(form.lastName) && cityValid(form.city)
         && addressValid(form.address) && emailValid(form.email)) {
            
          envoiCommande();
        } else {
            console.log('formulaire pas valide');
            alert("Veuillez verifier le formulaire!!");
        }


    } else {
        console.log('panier pas valide');
        alert("Veuillez choisir au moins un article !!");
    }


});

}
  function nameValid(input, name) {
    console.log(input);
    console.log(input.nextElementSibling);
    const regex= /^[a-z\éèàêâîiïù\-' ]{1,30}$/i;
  
    // Si la valeurdu champ ne correspond pas au motif de caractère alphabetique
    if (regex.test(input.value)) {
      input.nextElementSibling.textContent="";
      return true;
    }
    else {
      // Affiche un message d'erreur
      if(name === "name"){
        input.nextElementSibling.textContent = "Veuillez entrer un prénom au bon format";
      }
      if(name === "lastName"){
        input.nextElementSibling.textContent = "Veuillez entrer un nom au bon format";
      }
      return false;
    }
  }

  function addressValid(input) {
    
    const regex= /^[a-z\éèàêâîiïù\d\-' ]{5,50}$/i;
  
    // Si la valeurdu champ ne correspond pas au motif de caractère alphabetique
    if (regex.test(input.value)) {
      input.nextElementSibling.textContent="";
      return true;
    }
    else {
      // Affiche un message d'erreur
      input.nextElementSibling.textContent = "Veuillez entrer une adresse au bon format";
      return false;
    }
  }

  function cityValid(input) {
    
    const regex= /^[a-z\éèàêâîiïù\-' ]{1,30}$/i;
  
    // Si la valeurdu champ ne correspond pas au motif de caractère alphabetique
    if (regex.test(input.value)) {
      input.nextElementSibling.textContent="";
      return true;
    }
    else {
      // Affiche un message d'erreur
      input.nextElementSibling.textContent = "Veuillez entrer une ville au bon format";
      return false;
    }
  }
 
  function emailValid(input) {
    
    const regex= /^([a-z\d\._-]+)@([a-z\d_-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i;
  
    // Si la valeurdu champ ne correspond pas au motif de caractère alphabetique
    if (regex.test(input.value)) {
      input.nextElementSibling.textContent="";
      return true;
    }
    else {
      // Affiche un message d'erreur
      input.nextElementSibling.textContent = "Veuillez entrer un email au bon format";
      return false;
    }
  }

  function envoiCommande() {
   
      // Création de l'objet contact
      const contact = getContact();

      // Création du tableau avec les id des produits depuis le localStorage
      //const productsToOrder = getProductsFromLocalStorage().map(product => product._id);
      //console.log(productsToOrder);

       let productsToOrder = [];
      for (let i = 0; i < tableauLocalStorage.length; i++) {
        productsToOrder.push(tableauLocalStorage[i]._id);
      };
      // on créé l'objet qui détiendra les éléments de contact provenant du formulaire et les id produits du panier
    let orderObject = {
      contact: contact,
      products: productsToOrder
    };

    // préparation des options du fetch
    let fetchOptions = {
      method: 'POST',
      body: JSON.stringify(orderObject),
      headers: {
        "Content-Type": "application/json"
      }
    };

    fetch("http://localhost:3000/api/products/order", fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((order) => {
      localStorage.clear();
      document.location.href = `./confirmation.html?orderId=${order.orderId}`;
    })
    .catch((err) => {
      alert("Une erreur est survenue Veillez contacter l'administrateur !!");
          console.log(err);
    });
}

  function getContact (){
    const form = document.querySelector('.cart__order__form');

    return  {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      address: form.address.value,
      city: form.city.value,
      email: form.email.value,
    }
  }

