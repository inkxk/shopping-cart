import { createContext, ReactNode, useContext, useState } from "react";

type ShoppingCartProviderProps = {
    children: ReactNode;
};

type CartItem = {
    id: number;
    quantity: number;
}

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number;
    increaseCartQuantity: (id: number) => void;
    decreaseCartQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export const useShoppingCart = () => {
    return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
    const [cartItem, setCartItem] = useState<CartItem[]>([]);

    const getItemQuantity = (id: number) =>  {
        // 
        return cartItem.find(item => item.id === id)?.quantity || 0
    }

    const increaseCartQuantity = (id: number) => {
        setCartItem(currentItem => {
            if (currentItem.find(item => item.id === id) == null) {
                return [...currentItem, { id, quantity: 1 }]
            } else {
                return currentItem.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    return <ShoppingCartContext.Provider value={{getItemQuantity, increaseCartQuantity}}>{children}</ShoppingCartContext.Provider>;
};
