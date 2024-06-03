import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [totalWithGST, setTotalWithGST] = useState(0);

    return (
        <ProductContext.Provider value={{ products, setProducts, totalWithGST, setTotalWithGST }}>
            {children}
        </ProductContext.Provider>
    );
};
