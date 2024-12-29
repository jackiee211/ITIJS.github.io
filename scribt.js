let theme_toggle = document.querySelector(".theme_toggle");
const loading = document.querySelector(".loading");

// < ---------------------- Light && Dark --------------------- >
theme_toggle.addEventListener('click',()=>{
  document.body.classList.toggle('dark_mode');
})
// < ---------------------- Light && Dark --------------------- >

let products=[];
// < ---------------------- Loading Page --------------------- >
loading.classList.remove("d-none");
// < ---------------------- Loading Page --------------------- >
fetch('https://fakestoreapi.com/products').then(res => res.json()).then(data => {
    
    products=data;

   localStorage.setItem('products', JSON.stringify(products));
   // < ---------------------- Loading Page --------------------- >
   loading.classList.add("d-none");
   // < ---------------------- Loading Page --------------------- >
});


let storedProducts = localStorage.getItem('products');
let storeProducts=[];
if (storedProducts) {
    
    storeProducts = JSON.parse(storedProducts);
    console.log(products);
    
}
 let productContainer = document.querySelector('.products-container');
 console.log(productContainer);

 for (let i = 0; i < storeProducts.length; i++) {
 
    
    
    productContainer.innerHTML += `
        <div class="col-md-3 mb-5 col-4">
            <div class="card border-2"  style="width:300px; max-width:300px;">
              <a href="products-details.html"><img src="${storeProducts[i].image}" class="card-img-top" alt="Product1" width="100px" height="300px"></a>
              <div class="card-body text-center">
                <h5 class="card-title">${storeProducts[i].title}</h5>
                <p class="card-text">$${storeProducts[i].price}</p>
                <p class="catigore" style="color: rgba(0, 0, 0, 0.531); font-weight: 600;">${storeProducts[i].category}</p>
                <a href="#" class="btn btn-sm btn-outline-dark items" id="${storeProducts[i].id}">Buy Now</a>
              </div>
            </div>
          </div>

     `;
 
     
 }


let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    let cartItemsList = document.getElementById('cartItemsList');
    let totalAmount = document.getElementById('totalAmount');

    cartItemsList.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        let li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `${item.title} - $${item.price} <button class="btn btn-danger btn-sm float-end" onclick="removeFromCart(${item.id})">Remove</button>`;
        cartItemsList.appendChild(li);
        total += item.price;
    });
    totalAmount.textContent = total.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let product = products.find(p => p.id === productId);
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price
        });
        updateCart();
    }

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

document.querySelectorAll('.items').forEach(button => {
    button.addEventListener('click', function () {
        let productId = parseInt(this.id.replace('addToCartBtn-', ''));
        addToCart(productId);
    });
});

document.getElementById('clearCartBtn').addEventListener('click', function () {
    cart = [];
    updateCart();
});

updateCart();

document.getElementById('checkoutBtn').addEventListener('click', function () {
  if (cart.length === 0) {
      document.getElementById("checkOut").textContent = "Cart Empty"
      return;
  }
  let orders = JSON.parse(localStorage.getItem('orders')) || [];

  let newOrder = {
      id: cart.length+1,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price, 0),
      date: new Date().toLocaleString()
  };
  orders.push(newOrder);

  localStorage.setItem('orders', JSON.stringify(orders));

  cart = [];
  updateCart();

  document.getElementById("checkOut").textContent = "Your Order Has Been Submitted Successfully"

});
