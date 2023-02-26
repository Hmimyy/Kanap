//requete get
fetch("http://localhost:3000/api/products")
.then((response) =>{
    return response.json();
})
.then((products)=>{
    console.log(products);
    const items = document.getElementById("items");
    products.forEach(element => {
        // traitement 
        console.log(element);
        // ajouter l'element sur le dom 
       /*          <a href="./product.html?id=42">
        <article>
          <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
          <h3 class="productName">Kanap name1</h3>
          <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
        </article>
      </a> */
        // preparer les details à afficher 
        const link = document.createElement("a");
        const article = document.createElement("article");
        const image = document.createElement("img");
        const name = document.createElement("h3");
        const description = document.createElement("p");
//
        link.setAttribute("href", `./product.html?id=${element._id}`);
        image.setAttribute("src", `${element.imageUrl}`);
        image.setAttribute("alt", `${element.altTxt}`);

        name.setAttribute("class","productName");
        name.textContent= `${element.name}`;
        
        description.setAttribute("class","productDescription");
        description.textContent= `${element.description}`;
        
        // ajouter ces details sur la racine de l'objet
        article.appendChild(image);
        article.appendChild(name);
        article.appendChild(description);

        link.appendChild(article);

        items.appendChild(link);
    });
})
.catch((erreur)=> {
    console.log(erreur);
    alert("Une erreur est survenue Veuillez contacter l'administrateur du site!!");
});



