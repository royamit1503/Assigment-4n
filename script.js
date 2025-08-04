document.addEventListener('DOMContentLoaded', () => {
  const serviceItems = document.querySelectorAll('.service-item');
  const cartItemsContainer = document.getElementById('cart-items');
  const totalAmountElement = document.getElementById('total-amount');
  const bookingForm = document.getElementById('booking-form');
  const bookingMessage = document.getElementById('booking-message');
  const noItemsMessage = document.querySelector('.no-items');

  let cart = [];
  let snoCounter = 1;

  function renderCart() {
    if (cart.length === 0) {
      noItemsMessage.style.display = 'block';
      cartItemsContainer.innerHTML = '';
    } else {
      noItemsMessage.style.display = 'none';
      cartItemsContainer.innerHTML = '';
      let total = 0;
      snoCounter = 1;
      cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
                    <span>${snoCounter}</span>
                    <span>${item.name}</span>
                    <span>₹${item.price.toFixed(2)}</span>
                    <button class="remove-btn" data-service-id="${item.id}">-</button>
                `;
        cartItemsContainer.appendChild(cartItemElement);
        total += item.price;
        snoCounter++;
      });
      totalAmountElement.textContent = `₹${total.toFixed(2)}`;
    }
  }

  serviceItems.forEach(item => {
    const addButton = item.querySelector('.add-btn');
    addButton.addEventListener('click', () => {
      const serviceId = item.dataset.serviceId;
      const serviceName = item.dataset.serviceName;
      const servicePrice = parseFloat(item.dataset.price);

      const existingItem = cart.find(cartItem => cartItem.id === serviceId);

      if (!existingItem) {
        cart.push({
          id: serviceId,
          name: serviceName,
          price: servicePrice
        });
        addButton.textContent = 'Remove item -';
        addButton.classList.add('added');
        renderCart();
      } else {
        cart = cart.filter(cartItem => cartItem.id !== serviceId);
        addButton.textContent = 'Add item ⊕';
        addButton.classList.remove('added');
        renderCart();
      }
    });
  });

  cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const serviceIdToRemove = e.target.dataset.serviceId;
      cart = cart.filter(item => item.id !== serviceIdToRemove);

      const serviceItemElement = document.querySelector(`.service-item[data-service-id="${serviceIdToRemove}"]`);
      if (serviceItemElement) {
        const addButton = serviceItemElement.querySelector('.add-btn');
        addButton.textContent = 'Add item ⊕';
        addButton.classList.remove('added');
      }

      renderCart();
    }
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      bookingMessage.textContent = 'Please add some items to your cart first.';
      bookingMessage.style.color = 'red';
      return;
    }

    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // In a real-world scenario, you would send this data to a server
    console.log('Booking submitted:', {
      fullName,
      email,
      phone,
      services: cart,
      totalAmount: totalAmountElement.textContent
    });

    bookingMessage.textContent = 'Email Has been sent successfully';
    bookingMessage.style.color = 'green';

    // Reset cart and form after a short delay
    setTimeout(() => {
      cart = [];
      document.getElementById('full-name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('phone').value = '';
      document.querySelectorAll('.add-btn.added').forEach(btn => {
        btn.textContent = 'Add item ⊕';
        btn.classList.remove('added');
      });
      renderCart();
      bookingMessage.textContent = '';
    }, 3000);
  });

  renderCart(); // Initial render
});