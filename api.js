const mockProducts = {
    shirts: [
        {
            id: 1,
            category: "shirts",
            name: "Polo shirt",
            desc: "Polo shirt lauren",
            price: "800 MDL",
            img: "product-images/polo-jaket.webp"
        },
        {
            id: 2,
            category: "shirts",
            name: "Polo sweater",
            desc: "Polo sweater — Ralph Lauren. Cozy, knit pullover for cooler days.",
            price: "750 MDL",
            img: "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-5462_alternate10?$plpDeskRF$"
        },
        {
            id: 3,
            category: "shirts",
            name: "Classic Oxford Shirt",
            desc: "Oxford cloth button-down shirt by Ralph Lauren",
            price: "900 MDL",
            img: "product-images/Polo shirt.webp"
        }
    ],
    pants: [
        {
            id: 4,
            category: "pants",
            name: "Polo pants",
            desc: "Polo pants lauren",
            price: "1000 MDL",
            img: "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1469465_alternate1?$plpDeskRF$"
        },
        {
            id: 5,
            category: "pants",
            name: "Chino Pants",
            desc: "Premium chino pants - comfortable and stylish",
            price: "950 MDL",
            img: "product-images/polo pants.webp"
        }
    ],
    shoes: [
        {
            id: 6,
            category: "shoes",
            name: "Polo-inspired Sneakers",
            desc: "Classic white sneakers with Polo logo",
            price: "1100 MDL",
            img: "https://photos6.spartoo.co.uk/photos/189/18984042/18984042_1200_A.jpg"
        },
        {
            id: 7,
            category: "shoes",
            name: "Leather Oxford Shoes",
            desc: "Timeless leather oxford shoes for formal occasions",
            price: "1500 MDL",
            img: "https://cdn.shopify.com/s/files/1/1982/6381/files/Belk_d30fed34-8259-4d5b-8567-b4149cc91546_large.png?v=1771266331"
        }
    ]
};

const API = {
    getProductsByCategory: (category) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (mockProducts[category]) {
                    resolve(mockProducts[category]);
                } else {
                    reject(new Error(`Category "${category}" not found`));
                }
            }, 500 + Math.random() * 500);
        });
    },

    getAllProducts: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockProducts);
            }, 800);
        });
    },

    getProductById: (productId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let found = null;
                Object.values(mockProducts).forEach(categoryProducts => {
                    const product = categoryProducts.find(p => p.id === productId);
                    if (product) found = product;
                });
                if (found) {
                    resolve(found);
                } else {
                    reject(new Error(`Product with ID ${productId} not found`));
                }
            }, 300);
        });
    },

    searchProducts: (query) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = [];
                Object.values(mockProducts).forEach(categoryProducts => {
                    categoryProducts.forEach(product => {
                        if (product.name.toLowerCase().includes(query.toLowerCase()) ||
                            product.desc.toLowerCase().includes(query.toLowerCase())) {
                            results.push(product);
                        }
                    });
                });
                resolve(results);
            }, 400);
        });
    }
};
