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

const DUMMYJSON_CATEGORIES = {
    shirts: 'https://dummyjson.com/products/category/mens-shirts',
    pants: null, 
    shoes: 'https://dummyjson.com/products/category/mens-shoes'
};

const normalizeDummyProduct = (product, targetCategory, productIndex) => {
    // Folosim imaginile din mockProducts fără repetare
    const mockImages = mockProducts[targetCategory]?.map(p => p.img) || [];

    return {
        id: product.id,
        category: targetCategory,
        name: product.title,
        desc: product.description,
        price: `${product.price} USD`,
        img: mockImages[productIndex] || product.thumbnail || product.images?.[0] || ''
    };
};

const fetchDummyProducts = async () => {
    try {
        const results = await Promise.allSettled(
            Object.entries(DUMMYJSON_CATEGORIES)
                .filter(([_, url]) => url !== null) 
                .map(async ([category, url]) => {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`DummyJSON ${category} request failed: ${response.status}`);
                    }
                    const data = await response.json();
                    if (!data.products || !Array.isArray(data.products)) {
                        throw new Error(`DummyJSON ${category} response format unexpected`);
                    }
                    return { category, products: data.products };
                })
        );

        const grouped = { shirts: [], pants: [], shoes: [] };

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                const { category, products } = result.value;
                const normalized = products.map((p, index) => normalizeDummyProduct(p, category, index));
                grouped[category].push(...normalized);
            } else {
                console.warn(`Failed to load ${result.reason.category}:`, result.reason);
            }
        });

        
        Object.keys(DUMMYJSON_CATEGORIES).forEach(category => {
            if (DUMMYJSON_CATEGORIES[category] === null && mockProducts[category]) {
                grouped[category] = mockProducts[category];
            }
        });

        return grouped;
    } catch (error) {
        console.warn('Failed to load DummyJSON, using mockProducts as fallback:', error);
        return mockProducts;
    }
};

const API = {
    getProductsByCategory: async (category) => {
        const all = await fetchDummyProducts();
        if (all[category]) {
            return all[category];
        }
        throw new Error(`Category "${category}" not found`);
    },

    getAllProducts: async () => {
        return fetchDummyProducts();
    },

    getProductById: async (productId) => {
        const products = await API.getAllProducts();
        let found = null;
        Object.values(products).forEach(categoryProducts => {
            const product = categoryProducts.find(p => String(p.id) === String(productId));
            if (product) found = product;
        });
        if (found) return found;
        throw new Error(`Product with ID ${productId} not found`);
    },

    searchProducts: async (query) => {
        const products = await API.getAllProducts();
        const lowerQuery = query.toLowerCase();
        const results = [];
        Object.values(products).forEach(categoryProducts => {
            categoryProducts.forEach(product => {
                if (product.name.toLowerCase().includes(lowerQuery) ||
                    product.desc.toLowerCase().includes(lowerQuery)) {
                    results.push(product);
                }
            });
        });
        return results;
    }
};
