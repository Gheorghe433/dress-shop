class Cart {
    constructor() {
        this.items = this.loadCart();
        this.cartPanel = null;
        this.cartButton = null;
        this.closeButton = null;
        this.clearButton = null;
        this.finalizeButton = null;
        this.checkoutFormContainer = null;
        this.checkoutForm = null;

        document.addEventListener('DOMContentLoaded', () => {
            this.cartPanel = document.getElementById('cart-panel');
            this.cartButton = document.getElementById('cart-btn');
            this.closeButton = document.getElementById('close-cart-btn');
            this.clearButton = document.getElementById('clear-cart-btn');
            this.finalizeButton = document.getElementById('finalize-order-btn');
            this.checkoutFormContainer = document.getElementById('checkout-form-container');
            this.checkoutForm = document.getElementById('checkout-form');

            this.bindCartEvents();
            this.bindCheckoutEvents();
            this.updateBadge();
            this.renderCart();
        });
    }

    loadCart() {
        const cart = localStorage.getItem('dressShopCart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('dressShopCart', JSON.stringify(this.items));
        this.updateBadge();
        this.renderCart();
    }

    addItem(productId, productDetails, size = '8') {
        const existingItem = this.items.find(item => item.id === productId && item.size === size);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                size,
                quantity: 1,
                ...productDetails
            });
        }
        this.saveCart();
        alert(`Produs adăugat în coș (mărime ${size})!`);
        if (this.cartPanel && this.cartPanel.style.display === 'flex') {
            this.renderCart();
        }
    }

    parsePrice(priceString) {
        const priceText = String(priceString || '0');
        const amountMatch = priceText.match(/([0-9]+[.,]?[0-9]*)/);
        const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0;
        const currencyMatch = priceText.match(/(MDL|USD|EUR|RON|lei|Lei|usd|mdl)/i);
        const currency = currencyMatch ? currencyMatch[0].toUpperCase() : 'USD';
        return {
            amount: Number.isFinite(amount) ? amount : 0,
            currency: currency === 'LEI' ? 'MDL' : currency
        };
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getExchangeRates() {
        return {
            MDL: 1/18,
            USD: 1,
            EUR: 20/18,
            RON: 4.5/18
        };
    }

    convertToUSD(amount, currency) {
        const rates = this.getExchangeRates();
        const rate = rates[currency] || rates.USD;
        return amount * rate;
    }

    getTotalPriceUSD() {
        return this.items.reduce((sum, item) => {
            const { amount, currency } = this.parsePrice(item.price || '0 USD');
            return sum + this.convertToUSD(amount, currency) * item.quantity;
        }, 0);
    }

    formatUSD(value) {
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }

    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (!badge) {
            return;
        }
        const total = this.getTotalItems();
        if (total > 0) {
            badge.textContent = total;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalItemsSpan = document.getElementById('cart-total-items');
        const totalPriceSpan = document.getElementById('cart-total-price');

        if (!cartItemsContainer) {
            return;
        }

        cartItemsContainer.innerHTML = '';

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#666;">Coșul este gol.</p>';
        } else {
            this.items.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.style.display = 'flex';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.gap = '12px';
                itemDiv.style.padding = '12px';
                itemDiv.style.border = '1px solid #ddd';
                itemDiv.style.borderRadius = '8px';
                itemDiv.style.background = '#fff';

                itemDiv.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                    <div style="flex:1;">
                        <h4 style="margin:0; font-size:14px; font-weight:600;">${item.name}</h4>
                        <p style="margin:4px 0; font-size:12px; color:#666;">Mărime: ${item.size}</p>
                        <p style="margin:4px 0; font-size:12px; color:#666;">Cantitate: ${item.quantity}</p>
                        <p style="margin:4px 0; font-size:14px; font-weight:600;">${item.price}</p>
                    </div>
                    <button class="remove-item-btn" data-index="${index}" style="background:none; border:none; cursor:pointer; font-size:18px; color:#dc3545;">×</button>
                `;

                cartItemsContainer.appendChild(itemDiv);
            });

            // Add event listeners for remove buttons
            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.items.splice(index, 1);
                    this.saveCart();
                });
            });
        }

        if (totalItemsSpan) {
            totalItemsSpan.textContent = this.getTotalItems();
        }
        if (totalPriceSpan) {
            totalPriceSpan.textContent = this.formatUSD(this.getTotalPriceUSD());
        }
    }

    bindCartEvents() {
        if (this.cartButton) {
            this.cartButton.addEventListener('click', () => this.toggleCartPanel());
        }
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.hideCartPanel());
        }
        if (this.finalizeButton) {
            this.finalizeButton.addEventListener('click', () => this.finalizeOrder());
        }
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.items = [];
                this.saveCart();
                this.hideCartPanel();
            });
        }
    }

    finalizeOrder() {
        if (this.items.length === 0) {
            alert('Coșul este gol. Adaugă produse înainte de a finaliza comanda.');
            return;
        }
        this.showCheckoutForm();
    }

    bindCheckoutEvents() {
        if (this.checkoutForm) {
            this.checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));
        }
        const cancelBtn = document.getElementById('cancel-checkout');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideCheckoutForm());
        }
        const expiryInput = document.getElementById('expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => this.formatExpiry(e.target));
        }
    }

    formatExpiry(input) {
        let value = input.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        input.value = value;
    }

    showCheckoutForm() {
        const cartItems = document.getElementById('cart-items');
        const cartButtons = this.cartPanel.querySelector('div[style*="margin-top:auto"]');
        if (cartItems) cartItems.style.display = 'none';
        if (cartButtons) cartButtons.style.display = 'none';
        if (this.checkoutFormContainer) this.checkoutFormContainer.style.display = 'block';
    }

    hideCheckoutForm() {
        const cartItems = document.getElementById('cart-items');
        const cartButtons = this.cartPanel.querySelector('div[style*="margin-top:auto"]');
        if (cartItems) cartItems.style.display = 'grid';
        if (cartButtons) cartButtons.style.display = 'block';
        if (this.checkoutFormContainer) this.checkoutFormContainer.style.display = 'none';
    }

    handleCheckoutSubmit(e) {
        e.preventDefault();
        // Simple validation
        const formData = new FormData(this.checkoutForm);
        const data = Object.fromEntries(formData);
        // Skip validation for demo
        /*
        if (!data['first-name'] || !data['last-name'] || !data.address || !data['postal-code'] || !data['card-number'] || !data.expiry || !data.cvv) {
            alert('Te rugăm să completezi toate câmpurile.');
            return;
        }
        // Validate card details
        const cardNumber = data['card-number'].replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardNumber)) {
            alert('Numărul cardului este invalid. Trebuie să conțină 16 cifre.');
            return;
        }
        const expiry = data.expiry;
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            alert('Data expirării este invalidă. Folosește formatul MM/YY.');
            return;
        }
        const [month, year] = expiry.split('/').map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
            alert('Cardul este expirat sau data este invalidă.');
            return;
        }
        const cvv = data.cvv;
        if (!/^\d{3}$/.test(cvv)) {
            alert('CVV-ul este invalid. Trebuie să conțină 3 cifre.');
            return;
        }
        */
        // Save order
        this.saveOrder(data);
        // Simulate payment
        alert('Plată procesată cu succes! Comanda a fost finalizată.');
        this.items = [];
        this.saveCart();
        this.hideCheckoutForm();
        this.hideCartPanel();
    }

    toggleCartPanel() {
        if (!this.cartPanel) {
            return;
        }
        if (this.cartPanel.style.display === 'flex') {
            this.hideCartPanel();
        } else {
            this.showCartPanel();
        }
    }

    showCartPanel() {
        if (!this.cartPanel) {
            return;
        }
        this.renderCart();
        this.cartPanel.style.display = 'flex';
    }

    hideCartPanel() {
        if (!this.cartPanel) {
            return;
        }
        this.cartPanel.style.display = 'none';
    }

    saveOrder(formData) {
        const orders = this.loadOrders();
        const order = {
            id: Date.now(), // simple ID
            date: new Date().toISOString(),
            items: [...this.items],
            total: this.getTotalPriceUSD(),
            customer: {
                firstName: formData['first-name'],
                lastName: formData['last-name'],
                address: formData.address,
                postalCode: formData['postal-code']
            },
            status: 'Plasată'
        };
        orders.push(order);
        localStorage.setItem('dressShopOrders', JSON.stringify(orders));
    }

    loadOrders() {
        const orders = localStorage.getItem('dressShopOrders');
        return orders ? JSON.parse(orders) : [];
    }
}

const cart = new Cart();