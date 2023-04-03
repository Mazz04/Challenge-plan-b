class Product {
  constructor(id, name, price, stock, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }
  display() {
    return `
      <tr>
        <td>${this.id}</td>
        <td>${this.name}</td>
        <td>${this.price}</td>
        <td>${this.stock}</td>
        <td>
          <button onclick="subtract(${this.id})">-</button>
          <button onclick="add(${this.id})">+</button>
          <button onclick="remove(${this.id})">Remove</button>
        </td>
      </tr>
    `;
  }
}
const baseProducts = [
  new Product(1869, 'Mozzarella cheese', 5.99, 10),
  new Product(2452, 'Milk', 2.49, 20),
  new Product(3336, 'Fried potatoes', 3.99, 15),
  new Product(4862, 'Beer', 4.99, 30),
  new Product(5853, 'Coke', 1.99, 25)
];
class CustomProduct extends Product {
  constructor(id, name, price, stock, isOrganic, isGlutenFree) {
    super(id, name, price, stock);
    this.isOrganic = isOrganic;
    this.isGlutenFree = isGlutenFree;
  }
  display() {
    return `
      <tr>
        <td>${this.id}</td>
        <td>${this.name} (custom)</td>
        <td>${this.price}</td>
        <td>${this.stock}</td>
        <td>
          <button onclick="subtract(${this.id})">-</button>
          <button onclick="add(${this.id})">+</button>
          <button onclick="remove(${this.id})">Remove</button>
        </td>
      </tr>
    `;
  }
}
let customProducts = [];
function displayProducts(products) {
  const table = document.querySelector('table');
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Price</th>
      <th>stock</th>
      <th>Actions</th>
    </tr>
  `;
  products.forEach((product) => {
    table.innerHTML += product.display();
  });
}
displayProducts(baseProducts);
function search() {
  const input = document.querySelector('#search-input');
  const query = input.value.toLowerCase();
  let results = [];
  results = baseProducts.filter((product) => {
    return product.name.toLowerCase().includes(query) || product.id.toString().includes(query);
  });
  customProducts.forEach((product) => {
    if (product.name.toLowerCase().includes(query) || product.id.toString().includes(query)) {
      results.push(product);
    }
  });
  displayProducts(results);
}
function addNewProduct() {
  const nameInput = document.querySelector('#new-product-name');
  const priceInput = document.querySelector('#new-product-price');
  const stockInput = document.querySelector('#new-product-stock');
  const name = nameInput.value;
  const price = parseFloat(priceInput.value);
  const stock = parseInt(stockInput.value);
  if (name.trim() === '') {
    displayMessage('Please enter a name.', 'error');
    return;
  }
  if (isNaN(price) || price <= 0) {
    displayMessage('Please enter a valid price.', 'error');
    return;
  }
  if (isNaN(stock) || stock <= 0) {
    displayMessage('Please enter a valid stock.', 'error');
    return;
  }
  const id = Math.floor(Math.random() * 9000) + 1000;;
    while (baseProducts.concat(customProducts).some(product => product.id === id)) {
    id = Math.floor(Math.random() * 9000) + 1000;
  }
  const product = new Product(id, name, price, stock);
  customProducts.push(product);
  nameInput.value = '';
  priceInput.value = '';
  stockInput.value = '';
  displayMessage('Product added successfully.', 'success');
  displayProducts([...baseProducts, ...customProducts]);
}
function modifystock(id, amount) {
  const product = findProductById(id);
  if (product) {
    product.stock += amount;
    displayProducts([...baseProducts, ...customProducts]);
  }
}
function add(id) {
  modifystock(id, 1);
}
function subtract(id) {
  modifystock(id, -1);
}
function remove(id) {
  let productIndex = findProductIndexById(id);
  if (productIndex !== -1) {
    const product = customProducts[productIndex];
    customProducts.splice(productIndex, 1);
    displayProducts([...baseProducts, ...customProducts]);
    let customProductsFromStorage = localStorage.getItem('customProducts');
    customProductsFromStorage = customProductsFromStorage ? JSON.parse(customProductsFromStorage) : [];
    const updatedCustomProducts = customProductsFromStorage.filter((product) => {
      return product.id !== id;
    });
    localStorage.setItem('customProducts', JSON.stringify(updatedCustomProducts));
  }
}
function findProductById(id) {
let product = baseProducts.find((product) => {
  return product.id === id;
});
if (!product) {
  product = customProducts.find((product) => {
    return product.id === id;
  });
}
return product;
}
function findProductIndexById(id) {
let productIndex = baseProducts.findIndex((product) => {
  return product.id === id;
});
if (productIndex === -1) {
  productIndex = customProducts.findIndex((product) => {
    return product.id === id;
  });
}
return productIndex;
}
function displayMessage(message, type) {
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    messageContainer.innerHTML = message;
    messageContainer.classList.remove('success');
    messageContainer.classList.remove('error');
    messageContainer.classList.add(type);
  } else {
    console.error('Message container not found');
  }
}
function initialize() {
  initProducts();
  displayProducts([...baseProducts, ...customProducts]);
  const addBtn = document.querySelector('#add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', handleAddBtnClick);
  }
  const removeBtn = document.querySelector('#remove-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', handleRemoveBtnClick);
  }
  const searchInput = document.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInputChange);
  }
}
