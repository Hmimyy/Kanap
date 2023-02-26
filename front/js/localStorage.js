function getFromLocalStorage(){
    if(localStorage.getItem('cart')){
    return JSON.parse(localStorage.getItem('cart'));
    }   
    else return [];
}

function setLocalStorage(tableauProducts){
    localStorage.setItem('cart', JSON.stringify(tableauProducts));
}