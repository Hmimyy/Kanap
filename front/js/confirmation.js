const confirmationCommande = () => {
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);
    const orderId = searchParams.get('orderId');
    document.getElementById('orderId').textContent = orderId;   
}

confirmationCommande();