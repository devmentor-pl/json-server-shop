document.addEventListener('DOMContentLoaded', async function () {
    const productsUrl = '/products?_expand=author';
    const shopContainer = document.querySelector('.shop__container');

    loadProducts(productsUrl, shopContainer);

    // 3) dodajemy listener do całego kontenera
    shopContainer.addEventListener('click', async function (e) {
        if (e.target.name === 'deleteBtn') {
            const productId = e.target.parentElement.getAttribute('data-id');
            await fetchData(
                `/products/${productId}`,
                (options = { method: 'DELETE' })
            );
            shopContainer.innerText = '';
            loadProducts(productsUrl);
        }
    });
});

async function loadProducts(resource, container) {
    const products = await fetchData(resource);

    const categoriesData = await getCategories();
    products.forEach(function (product) {
        displayProduct(product, categoriesData, container);
    });
}

async function fetchData(path = '', options = { method: 'GET' }) {
    const url = 'http://localhost:3000' + path;
    const promise = await fetch(url, options);
    try {
        return promise.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getCategories() {
    const categories = await fetchData('/categories');
    return categories;
}

async function displayProduct(product, categoriesData, container) {
    const productContainer = document.createElement('article');
    // 1) dodajemy id do atrybutu dataset
    productContainer.setAttribute('data-id', product.id);

    // 2) tworzymy przycisk usuwania
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'usuń';
    deleteBtn.name = 'deleteBtn';

    const titleEl = document.createElement('h2');
    titleEl.innerHTML = product.title;

    const authorEl = document.createElement('small');
    authorEl.innerHTML = 'Autor: ' + product.author.name;

    const categoriesContainer = document.createElement('div');

    const categoryEl = document.createElement('p');
    categoryEl.innerHTML = 'Kategoria: ';

    product.categoriesId.forEach(function (categoryId) {
        const category = categoriesData.find(
            element => categoryId === element.id
        );
        const categoryName = category.name;
        categoryEl.innerHTML = categoryEl.innerHTML + categoryName + ' ';

        categoriesContainer.appendChild(categoryEl);
    });

    const descriptionEl = document.createElement('p');
    descriptionEl.innerHTML = product.description;

    const priceEl = document.createElement('strong');
    priceEl.innerHTML = 'Cena: ' + product.price + ' zł';

    productContainer.appendChild(titleEl);
    productContainer.appendChild(authorEl);
    productContainer.appendChild(categoriesContainer);
    productContainer.appendChild(descriptionEl);
    productContainer.appendChild(priceEl);
    // 2a) dodajemy przycisk do rodzica
    productContainer.appendChild(deleteBtn);

    container.appendChild(productContainer);
}
