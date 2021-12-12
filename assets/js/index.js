var backendUrl = "https://aqueous-woodland-92918.herokuapp.com/api";

async function getAllProducts(page = 1, name, category) {
    var baseUrl = `${backendUrl}/products?page=${page}`;
    var items = [];
    var cards = [];
    var totalItems;
    var totalPages;
    var currentPage;
    var hasItems = false;
    console.log(name);
    if (name != null || name) baseUrl += `&name=${name}`;
    if (category != null) baseUrl += `&category=${category}`

    await fetch(baseUrl,
        { method: 'GET', mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            if (!data.done) alert('Hubo un error obteniendo los productos');
            items = data.data.result;
            totalItems = data.data.totalItems;
            totalPages = data.data.totalPages;
            currentPage = data.data.currentPage;
        })


    if (items.length > 0) {
        hasItems = true;
        for (const i in items) {
            const product = items[i];
            const itemId = product.id;
            const itemName = product.name;
            const itemPrice = product.price;
            const itemImg = product.url_image || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
            const itemDiscount = product.discount / 100;
            const hasDiscount = itemDiscount > 0;
            const itemCategory = product.category;

            const newCard = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="customCard">
                    <img src="${itemImg}" alt="${itemName}">
                    <div class="description">
                        <div class="itemName">${itemName}</div>
                        <div class="itemCategory"><span class="badge bg-secondary">${itemCategory}</span></div>
                        <div class="box">
                            <div class="itemPrice">$ ${hasDiscount ? `<span class="discounted">${itemPrice}</span>` : ''} <span>${itemDiscount > 0 ? (itemPrice - (itemPrice * itemDiscount)).toFixed(1) : itemPrice}</span></div>
                            <div class="buybtn"> <button>Comprar</button> </div>
                        </div>
                    </div>
                </div>
            </div>
            `
            cards.push(newCard);
        }
    }

    return { cards, totalItems, totalPages, currentPage, hasItems };
}

async function getAllCategories() {
    var baseUrl = `${backendUrl}/categories`;
    var categories = [];

    await fetch(baseUrl, { method: 'GET', mode: 'cors' })
        .then(result => result.json())
        .then(data => categories = data.data);
    //

    for (const key in categories) {
        const element = categories[key];
        $("#categoryList").append(new Option(element.name, element.id));
    }
}

$(async () => {
    var page = 1;
    var name = '';
    var category;
    const pageQuery = new URLSearchParams(window.location.search);
    if (pageQuery.has('page')) {
        page = pageQuery.get('page')
    }
    if (pageQuery.has('name') && pageQuery.get('name') != '') {
        name = pageQuery.get('name')
    }
    if (pageQuery.has('category')) {
        category = pageQuery.get('category')
    }


    var items = await getAllProducts(page, name, category);
    var categories = await getAllCategories();
    if (items.cards.length > 0) {
        for (const index in items.cards) {
            const element = items.cards[index];
            $("#container").append(element)
        }
        if (items.totalPages > 1) {
            for (let i = 1; i <= items.totalPages; i++) {
                $("#pagination").append(`<a href="./?page=${i}" class="btn btn-primary">${i}</a>`)
            }
        }
        $("#totalItems").text(items.totalItems);
    } else {
        $("#title").remove();
        $("#container").append(`<div class="col noItems"> No hay items para mostrar 😥 </div>`)
    }
})
