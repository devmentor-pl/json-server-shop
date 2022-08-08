document.addEventListener('DOMContentLoaded', async function () {
    const productsUrl = '/products?_expand=author';
    const shopContainer = document.querySelector('.shop__container');
    const authorsList = document.querySelector('.shop__authorsList');
    const priceForm = document.querySelector('.shop__priceForm');
    const searchForm = document.querySelector('.shop__searchForm');

    const authorsData = await getAuthors();

    if (authorsData.length !== 0) {
        createDropList(authorsData, authorsList);
    }

    loadProducts(productsUrl, shopContainer);

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        shopContainer.innerHTML = '';
        const keyword = searchForm.keyword.value;
        loadProducts(`${productsUrl}&q=${keyword}`);
    });

    authorsList.addEventListener('change', function (e) {
        shopContainer.innerHTML = '';
        const authorId = e.target.value;
        loadProducts(`/authors/${authorId}${productsUrl}`);
    });

    priceForm.addEventListener('submit', function (e) {
        e.preventDefault();
        shopContainer.innerHTML = '';
        const min = priceForm.min.value;
        const max = priceForm.max.value;
        const sorting = priceForm.sorting.value;
        loadProducts(
            `${productsUrl}&price_gte=${min}&price_lte=${max}&_sort=price&_order=${sorting}`
        );
    });
});

async function getAuthors() {
    const authors = await fetchData('/authors');
    return authors;
}

function createDropList(elements, dropList) {
    elements.forEach(function (element) {
        const optionEl = document.createElement('option');
        optionEl.value = element.id;
        optionEl.innerText = element.name;

        dropList.appendChild(optionEl);
    });
}

async function loadProducts(resource, container) {
    const products = await fetchData(resource);

    const categoriesData = await getCategories();

    if (products.length !== 0 && categoriesData.length !== 0) {
        products.forEach(function (product) {
            displayProduct(product, categoriesData, container);
        });
    }
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

    container.appendChild(productContainer);
}
