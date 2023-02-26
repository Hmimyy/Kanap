//récupération Id dans l'url
const urlSearch = window.location.search;
console.log(urlSearch);
//Extraction de l'id
const productId = new URLSearchParams(urlSearch);
console.log(productId);
const id = productId.get("id");
console.log(id)

//Affichage produits
const url = `http://localhost:3000/api/products/${id}`;
fetch(url)
.then(response => response.json())
.then(data => {
  
  const article = {
  name : data.name,
  description : data.description,
  price : data.price,
  colors : data.colors,
  imageUrl : data.imageUrl,
  _id : data._id,
  altTxt : data.altTxt
}
displayProduct(article);

})
.catch((erreur)=> {
    console.log(erreur);
    alert("Une erreur est survenue Veuillez contacter l'administrateur du site!!");
});

function displayProduct(product){

        // preparer les details à afficher
        const Img = document.querySelector(".item__img");
        const title = document.querySelector("title");
        const price = document.getElementById("price");
        const description = document.getElementById("description");
        const colors = document.getElementById("colors");
        const quantite = document.getElementById("quantity");
        const addToCart = document.getElementById("addToCart");

        // mettre à jour le dom par les données de l'api
        const image = document.createElement('img');
        image.setAttribute("src", `${product.imageUrl}`);
        image.setAttribute("alt", `${product.altTxt}`);
        Img.appendChild(image);

        title.textContent= `${product.name}`;
        price.textContent= `${product.price}`;
        description.textContent = `${product.description}`;

        
        product.colors.forEach(element => {
          console.log(element);
          const option = document.createElement('option');
          option.setAttribute('value', element);
          option.text = element;

          colors.appendChild(option);
        });
        /*
        let options = colors.innerHTML;
        product.colors.forEach(element => {
       options +=`<option value="${element}">${element}</option>`;
        });
        colors.innerHTML = options;
        */

        quantite.addEventListener('change', () =>{
          // appel des fonctions de controle des champs saisis
          let quantity = parseInt(quantite.value);
          controleQte(quantity);
        });

        colors.addEventListener('change', () =>{
          // appel des fonctions de controle des champs saisis
          controleColor(colors.value);
        });
        
// creer une function addToCart qui ajout le produit au panier

addToCart.addEventListener('click', () =>{
  // appel des fonctions de controle des champs saisis
  let quantity = parseInt(quantite.value);
  let validQty= controleQte(quantity);
  let validColor = controleColor(colors.value);
  
  // si les deux champs sont valid je mets à jour mon stock d'article sur le localstorage 
  if(validColor && validQty){

    let productPanier = {
      _id : id,
      color : colors.value,
      quantite : quantity,  
    };
  
    
// productTab est un tableau qui contien les articles du panier
let tableauLocalStorage = getFromLocalStorage();
     
      const productInCart = tableauLocalStorage.find((product) => product._id === productPanier._id && product.color === productPanier.color);
      if(productInCart) {
          let newQty = productInCart.quantite + quantity;
          if(controleQte(newQty)){
            productInCart.quantite += quantity;
          }
          
         
      } else {
        tableauLocalStorage.push(productPanier);
      }
      setLocalStorage(tableauLocalStorage);
      window.location.href = 'cart.html';
  
  }
 });

        ///////////////
}

