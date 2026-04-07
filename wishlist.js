class Wishlist {
    constructor() {
        this.items = this.loadWishlist();
        this.updateHearts();
    }

    loadWishlist() {
        const wishlist = localStorage.getItem('dressShopWishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    }

    saveWishlist() {
        localStorage.setItem('dressShopWishlist', JSON.stringify(this.items));
        this.updateHearts();
    }

    toggleItem(productId, productDetails) {
        const existingIndex = this.items.findIndex(item => item.id === productId);
        if (existingIndex > -1) {
            
            this.items.splice(existingIndex, 1);
            alert('Produs eliminat din wishlist!');
        } else {
            
            this.items.push({
                id: productId,
                ...productDetails
            });
            alert('Produs adăugat în wishlist!');
        }
        this.saveWishlist();
    }

    isInWishlist(productId) {
        return this.items.some(item => item.id === productId);
    }

    getWishlist() {
        return this.items;
    }

    updateHearts() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = parseInt(btn.dataset.productId);
            const isInWishlist = this.isInWishlist(productId);
            btn.textContent = isInWishlist ? '❤️' : '🤍';
        });
    }
}

const wishlist = new Wishlist();