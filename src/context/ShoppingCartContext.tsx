import { createContext, ReactNode, useContext, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode;
};

type CartItem = {
    id: number;
    quantity: number;
};

type ShoppingCartContext = {
    openCart: () => void;
    closeCart: () => void;
    getItemQuantity: (id: number) => number;
    increaseCartQuantity: (id: number) => void;
    decreaseCartQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    cartQuantity: number;
    cartItem: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export const useShoppingCart = () => {
    return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
    const [cartItem, setCartItem] = useLocalStorage<CartItem[]>("shopping-cart", []);
    const [isOpen, setIsOpen] = useState(false);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    // initial = 0, quantity=sumผลจากแต่ละรอบloop, cartQuantity=resultผลลัพธ์สุดท้ายที่บวกกันทั้งหมด
    const cartQuantity = cartItem.reduce((quantity, item) => quantity + item.quantity, 0);

    const getItemQuantity = (id: number) => {
        // ถ้าใน cart มี item
        // return item.quantity
        // ถ้าไม่มี return 0
        return cartItem.find((item) => item.id === id)?.quantity || 0;
    };

    const increaseCartQuantity = (id: number) => {
        setCartItem((currentItem) => {
            if (currentItem.find((item) => item.id === id) == null) {
                // ถ้าไม่มี item ใน cart
                // สร้าง item ใหม่
                return [...currentItem, { id, quantity: 1 }];
            } else {
                return currentItem.map((item) => {
                    if (item.id === id) {
                        // ถ้ามี item ใน cart
                        // item.id = id ที่ส่งมา
                        // item.quantity + 1
                        return { ...item, quantity: item.quantity + 1 };
                    } else {
                        // item.id !== id
                        // return ตัวเดิม
                        return item;
                    }
                });
            }
        });
    };

    const decreaseCartQuantity = (id: number) => {
        setCartItem((currentItem) => {
            if (currentItem.find((item) => item.id === id)?.quantity === 1) {
                // ถ้า item ใน cart มี quantity == 1
                // ลบ item นั้นออก โดยใช้ filter
                return currentItem.filter((item) => item.id !== id);
            } else {
                return currentItem.map((item) => {
                    if (item.id === id) {
                        // ถ้ามี item ใน cart
                        // item.id = id ที่ส่งมา
                        // item.quantity - 1
                        return { ...item, quantity: item.quantity - 1 };
                    } else {
                        // item.id !== id
                        // return ตัวเดิม
                        return item;
                    }
                });
            }
        });
    };

    const removeFromCart = (id: number) => {
        setCartItem((currentItem) => {
            return currentItem.filter((item) => item.id !== id);
        });
    };

    return (
        <ShoppingCartContext.Provider
            value={{
                getItemQuantity,
                increaseCartQuantity,
                decreaseCartQuantity,
                removeFromCart,
                openCart,
                closeCart,
                cartQuantity,
                cartItem,
            }}
        >
            {children}
            <ShoppingCart isOpen={isOpen} />
        </ShoppingCartContext.Provider>
    );
};
