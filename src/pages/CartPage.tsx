import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

import { ICartProduct } from "../schemas/cart";
import CartProduct from "../components/CartProduct";
import '../styles/CartPage.scss';

const CartPage: React.FC = () => {
    const [cartProducts, setCartProducts] = useState<ICartProduct[] | null>(null);

    const navigate = useNavigate();

    const updateCartProducts = () => {
        let token = Cookies.get('token');
        if (!token) {
            navigate(`/login`);
        }
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/carts/get`, {
            headers: {
              Authorization: `Bearer ${token}`
            }}).then(response => {
            const data = response.data;
            setCartProducts(data);
          })
          .catch(error => {});
    }

    useEffect(() => {
        updateCartProducts();
    }, []);

    return (
        <div className="cart-page container">
            <h1 className="title">Корзина</h1>
            {
                cartProducts ?
                    cartProducts.length == 0 ?
                        <h1>У вас нет товаров в корзине</h1>
                    :  cartProducts.map(product => 
                        <CartProduct {...product} updateProducts={updateCartProducts}/>
                    )
                : <h1>Загрузка...</h1>
            }
            {
                cartProducts ?
                    cartProducts.length != 0 ?
                        <>
                            <b className="cart-page__total-price">Итого: {cartProducts.map(p => p.totalPrice).reduce((sum, current) => sum + current, 0)} BYN</b>
                            <div className="cart-page__create-order">Оформить заказ</div>
                        </>
                    : ''
                : ''
            }
        </div>
    )
}

export default CartPage;