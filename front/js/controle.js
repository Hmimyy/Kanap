
/*renseignements de la couleur et la quantité */

function controleQte(quantite){
    if(quantite<1 || quantite>100) {
      alert("Veuillez saisir une quantité entre 1 et 100 !");
      return false;  
    }
    else return true; 
  }
  
  function controleColor(color){
    if(color === "" || color === null){
      alert("Veuillez choisir une couleur !");
      return false;
    }
    else return true;
  }
  
  