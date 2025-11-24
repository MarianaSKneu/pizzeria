function on(){
    // display overlay
    const turnOn = document.getElementById("overlay");
    turnOn.style.display = 'block';
    // turn off vertical scroll
    const overflow = document.querySelector("body");
    overflow.style.overflow = 'hidden';
}
function off(){
    // display overlay
    const turnOff = document.getElementById("overlay");
    turnOff.style.display = 'none';
    // turn off vertical scroll
    const overflow = document.querySelector("body");
    overflow.style.overflow = '';
}


/* product and cart pages*/ 

document.addEventListener('DOMContentLoaded', function () {
    const cartOverlay = document.getElementById("cart-overlay");
    const selectQuanOverlay = document.getElementById("select-quan-overlay");
    const pizzaElements = document.querySelectorAll('.add-selected');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    function onCart(quantity) {
        if (quantity != "0") {
            cartOverlay.classList.add("display");
            cartOverlay.addEventListener("click", offCart);
        } else {
            selectQuanOverlay.classList.add("display");
            selectQuanOverlay.addEventListener("click", offCart);
        }
    }

    function offCart() {
        cartOverlay.classList.remove("display");
        selectQuanOverlay.classList.remove("display");
    }

    function updateCounter(element, value) {
        element.textContent = value;
    }

    function handleQuantityButton(button, increment) {
        const counter = button.closest('.add-selected').querySelector('.counter');
        let currentValue = parseInt(counter.textContent);
        if (increment) {
            if (currentValue < 10) {
                currentValue++;
                updateCounter(counter, currentValue);
            }
        } else {
            if (currentValue > 0) {
                currentValue--;
                updateCounter(counter, currentValue);
            }
        }
    }

    pizzaElements.forEach(function (pizza) {
        const minusBtn = pizza.querySelector('.minusBtn');
        const plusBtn = pizza.querySelector('.plusBtn');

        minusBtn.addEventListener('click', function () {
            handleQuantityButton(this, false);
        });

        plusBtn.addEventListener('click', function () {
            handleQuantityButton(this, true);
        });
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(event) {
        
        const pizzaContainer = event.target.parentElement;
        const pizzaName = pizzaContainer.querySelector('h4').textContent;
        console.log(pizzaName)
        const pizzaPrice = parseFloat(pizzaContainer.querySelector('h4').textContent.replace(/\D/g, ''));
        const pizzaId = pizzaContainer.dataset.pizzaId;
        const counterVal = parseInt(pizzaContainer.querySelector('.counter').textContent);
        let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

        const existingPizzaIndex = cartItems.findIndex(item => item.name === pizzaName);
        if (existingPizzaIndex !== -1) {
            cartItems[existingPizzaIndex].quantity += counterVal;
        } else {
            cartItems.push({ id: pizzaId, name: pizzaName, price: pizzaPrice, quantity: counterVal });
        }

        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        resetCounter(pizzaContainer);
        updateOrderDetails(cartItems);
        onCart(counterVal);
    }

    function resetCounter(container) {
        container.querySelector('.counter').textContent = '0';
    }

    function updateOrderDetails(cartItems) {
        const orderDetailsContainer = document.getElementById('orderDetails');
        let totalPrice = 0;

        if (orderDetailsContainer) {
            orderDetailsContainer.innerHTML = '';

            cartItems.forEach((item, index) => {
                totalPrice += item.price * item.quantity;
                const itemElement = document.createElement('div');
                itemElement.dataset.itemId = item.id;
                itemElement.dataset.itemQuantity = item.quantity;
                itemElement.classList.add('orderDetails');

                if (item.quantity !== 0) {
                    const itemParagraph = document.createElement('p');
                    itemParagraph.textContent = `${item.name} - Quantity: ${item.quantity} - Price: $${(item.price * item.quantity / 100).toFixed(2)}`;
                    itemElement.appendChild(itemParagraph);

                    const removeButton = document.createElement('button');
                    removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
                    removeButton.addEventListener('click', () => removeItem(index));
                    itemElement.appendChild(removeButton);
                }

                orderDetailsContainer.appendChild(itemElement);
            });

            const totalDiv = document.createElement('div');
            const subTotal = totalPrice / 100;
            const total = (totalPrice + totalPrice * 0.09) / 100;
            totalDiv.innerHTML = `Subtotal: $${subTotal.toFixed(2)}<br/>Total: $${total.toFixed(2)}`;
            orderDetailsContainer.appendChild(totalDiv);
        }
    }

    function removeItem(index) {
        let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        cartItems.splice(index, 1);
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateOrderDetails(cartItems);
    }

    updateOrderDetails(JSON.parse(sessionStorage.getItem('cartItems')) || []);
});









