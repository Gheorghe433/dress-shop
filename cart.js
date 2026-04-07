class Cart {
    constructor() {
        this.items = this.loadCart();
        this.cartPanel = null;
        this.cartButton = null;
        this.closeButton = null;
        this.clearButton = null;

        document.addEventListener('DOMContentLoaded', () => {
            this.cartPanel = document.getElementById('cart-panel');
            this.cartButton = document.getElementById('cart-btn');
            this.closeButton = document.getElementById('close-cart-btn');
            this.clearButton = document.getElementById('clear-cart-btn');

            this.bindCartEvents();
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

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
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

    bindCartEvents() {
        if (this.cartButton) {
            this.cartButton.addEventListener('click', () => this.toggleCartPanel());
        }
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.hideCartPanel());
        }
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.items = [];
                this.saveCart();
                this.hideCartPanel();
            });
        }
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

    renderCart() {
        const itemsContainer = document.getElementById('cart-items');
        const totalNode = document.getElementById('cart-total');
        if (!itemsContainer || !totalNode) {
            return;
        }

        itemsContainer.innerHTML = '';
        if (this.items.length === 0) {
            itemsContainer.innerHTML = '<p style="margin:0; color:#444;">Coșul este gol.</p>';
        } else {
            this.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.style.padding = '12px';
                itemElement.style.border = '1px solid #ddd';
                itemElement.style.borderRadius = '10px';
                itemElement.style.background = '#f9f9f9';
                itemElement.innerHTML = `
                    <div style="display:flex; gap:12px; align-items:flex-start;">
                        <img src="${item.img || ''}" alt="${item.name || 'Produs'}" style="width:72px; height:72px; object-fit:cover; border-radius:12px; flex-shrink:0; background:#eee;">
                        <div style="flex:1; min-width:0;">
                            <strong style="display:block; margin-bottom:6px;">${item.name || 'Produs'}</strong>
                            <p style="margin:0 0 6px; color:#555; font-size:0.95rem;">${item.desc || ''}</p>
                            <p style="margin:0 0 6px; color:#555; font-size:0.95rem;">Mărime: ${item.size || 'M'}</p>
                            <span style="font-size:0.95rem; color:#333;">${item.price || ''}</span>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; justify-content:space-between;">
                            <span style="font-weight:700; color:#111;">x${item.quantity}</span>
                        </div>
                    </div>
                `;
                itemsContainer.appendChild(itemElement);
            });
        }

        totalNode.textContent = this.getTotalItems();
    }
}

const cart = new Cart();