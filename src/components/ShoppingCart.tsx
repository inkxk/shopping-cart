import React from "react";
import { Offcanvas } from "react-bootstrap";

const ShoppingCart = () => {
    return (
        <Offcanvas show={true} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
        </Offcanvas>
    );
};

export default ShoppingCart;
