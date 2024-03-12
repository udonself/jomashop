import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';

import { ICartProduct } from "../schemas/cart";
import { setCount } from '../store/store';
import '../styles/CartProduct.scss';

interface CartProductProps extends ICartProduct {
    updateProducts: () => void;
}

const CartProduct: React.FC<CartProductProps> = ({
    id,
    name,
    imageUrl,
    price,
    quantity,
    totalPrice,
    updateProducts
}) => {
    const dispatch = useDispatch();

    const addQuantity = (quantity: number) => {
        let token = Cookies.get('token');
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const data = {
            id: id,
            quantity: quantity
        };
        axios.post(`${process.env.REACT_APP_BASE_API_URL}/carts/add`, data, { headers })
        .then(response => {
            const data = response.data;
            dispatch(setCount(data.total_items));
            updateProducts();
        })
        .catch(error => {  });
    }

    return (
        <div className="cart-product">
            <div className="cart-product__column cart-product__image-column">
                <img className="cart-product__image" src={imageUrl} alt="product" />
            </div>
            <div className="cart-product__column cart-product__description-column">
                <h5 className="cart-product__name">{name}</h5>
                <span><b>{price} BYN</b> за шт.</span>
            </div>
            <div className="cart-product__column cart-product__quantity-column">
                <div className="quantity-changer">
                    <span className="quantity-changer__action" onClick={() => addQuantity(-1)}>-</span>
                    <span className="quantity-changer__value">{quantity}</span>
                    <span className="quantity-changer__action" onClick={() => addQuantity(1)}>+</span>
                </div>
            </div>
            <div className="cart-product__column cart-product__total-column">
                <b className="cart-product__total-price">{totalPrice} BYN</b>
            </div>
        </div>
    )
}

export default CartProduct;