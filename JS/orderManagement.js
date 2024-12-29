document.getElementById("showBtn").addEventListener("click", function (e) {
    let products = [];

    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            products = data;
            localStorage.setItem('products', JSON.stringify(products));
            showProducts(products);
    });


    function showProducts(products) {
        let prodList = document.querySelector('.prodList');
        prodList.innerHTML = '';

        products.forEach(product => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.title}" width="50" height="50"></td>
                <td>${product.title}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>
                    <button class="btn btn-warning btn-sm editBtn" id="${product.id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteBtn" id="${product.id}">Delete</button>
                </td>
            `;
            prodList.appendChild(row);
        });

        document.querySelectorAll('.editBtn')
            .forEach(button => {
                button.addEventListener('click', function () {
                    let productId = button.getAttribute('id');
                    editProduct(productId, products);
                });
            });

        document.querySelectorAll('.deleteBtn')
            .forEach(button => {
                button.addEventListener('click', function () {
                    let productId = button.getAttribute('id');
                    deleteProduct(productId, products);
                });
        });
    }

    document.getElementById('addProductBtn').addEventListener('click', function () {
        document.getElementById('productForm').reset();
        document.getElementById('modalTitle').textContent = 'Add Product';
        
        let modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    });

    function editProduct(productId, products) {
        let product = products.find(prod => prod.id == productId);
        if (product) {
            document.getElementById('modalTitle').textContent = 'Edit Product';

            let modal = new bootstrap.Modal(document.getElementById('productModal'));
            modal.show();

            document.getElementById('productForm').onsubmit = function (e) {
                product.title = document.getElementById('productName').value;
                product.category = document.getElementById('productCategory').value;
                product.price = parseFloat(document.getElementById('productPrice').value);
                product.image = document.getElementById('productImage').value;

                localStorage.setItem('products', JSON.stringify(products));
                showProducts(products);

                modal.hide();
            };
        }
    }

    function deleteProduct(productId, products) {
        let newProducts = products.filter(prod => prod.id != productId);
        localStorage.setItem('products', JSON.stringify(newProducts));
        showProducts(newProducts);
    }

    document.getElementById('productForm').onsubmit = function (e) {
        let newProduct = {
            id: products.length+1,
            title: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            image: document.getElementById('productImage').value
        };

        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        showProducts(products);

        let modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.hide();
    };
});

function showOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersTable = document.getElementById('ordersTable');

    ordersTable.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>
                <ul>
                    ${order.items.map(item => `<li>${item.title} - $${item.price}</li>`).join('')}
                </ul>
            </td>
            <td>$${order.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-warning btn-sm confirmBtn" id="${order.id}">confirm</button>
                <button class="btn btn-danger btn-sm declineBtn" id="${order.id}">Decline</button>
            </td>
        `;
        ordersTable.appendChild(row);

    });
    // confirm
    document.querySelectorAll('.confirmBtn').forEach(button => {
        button.addEventListener('click', function () {
            const orderID = button.getAttribute('id');
            confirmOrder(orderID);
        });
    });
    function confirmOrder(orderID) {
        const updatedOrders = orders.filter(order => order.id != orderID);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        showOrders();
        document.getElementById("orderMsg").textContent = "Order Confirmed"
    }
    // decline
    document.querySelectorAll('.declineBtn').forEach(button => {
        button.addEventListener('click', function () {
            const orderID = button.getAttribute('id');
            declineOrder(orderID);
        });
    });
    function declineOrder(orderID) {
        const updatedOrders = orders.filter(order => order.id != orderID);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        showOrders();
        document.getElementById("orderMsg").textContent = "Order Declined"
    }
}



document.getElementById("showOrdersBtn").addEventListener('click', showOrders);


