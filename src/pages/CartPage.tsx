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
    const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

    // order details
    const [phone, setPhone] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [house, setHouse] = useState<string>('');
    const [apartment, setApartment] = useState<string>('');

    const navigate = useNavigate();

    const placeOrderClick = () => {
        if(!isPlacingOrder){
            setIsPlacingOrder(true);
            return;
        }
        // create order
        let token = Cookies.get('token');
        if (!token) {
            navigate(`/login`);
        }
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const data = {
            phone: phone,
            city: city,
            street: street,
            house: house,
            apartment: apartment
        };
        axios.post(`${process.env.REACT_APP_BASE_API_URL}/orders/create`, data, { headers })
        .then(response => {
            navigate(`/profile`);
        })
        .catch(error => {  });
    }

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
                cartProducts && cartProducts.length != 0 ? <hr className="separator"/> : ''
            }
            {
                cartProducts ?
                    cartProducts.length == 0 ?
                        <h1>У вас нет товаров в корзине</h1>
                    :  cartProducts.map(product => 
                        <>
                            <CartProduct {...product} updateProducts={updateCartProducts}/>
                            <hr className="separator"/>
                        </>
                    )
                : <h1>Загрузка...</h1>
            }
            {
                cartProducts ?
                    cartProducts.length != 0 ?
                        <>
                            <b className="cart-page__total-price">Итого: {cartProducts.map(p => p.totalPrice).reduce((sum, current) => sum + current, 0)} BYN</b>
                            {
                                isPlacingOrder ? 
                                    <div className="order-details">
                                        
                                        <div className="order-details__row row2">
                                            <div className="order-details__column column2">
                                                <h5 className="order-details__title">Телефон</h5>
                                                <input type="text" className="order-details__input" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                                            </div>
                                            <div className="order-details__column column2">
                                                <h5 className="order-details__title">Город</h5>
                                                <input type="text" className="order-details__input"  value={city} onChange={(e) => setCity(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="order-details__row row3">
                                            <div className="order-details__column column3">
                                                <h5 className="order-details__title">Улица</h5>
                                                <input type="text" className="order-details__input" value={street} onChange={(e) => setStreet(e.target.value)}/>
                                            </div>
                                            <div className="order-details__column column3">
                                                <h5 className="order-details__title">Дом</h5>
                                                <input type="text" className="order-details__input" value={house} onChange={(e) => setHouse(e.target.value)}/>
                                            </div>
                                            <div className="order-details__column column3">
                                                <h5 className="order-details__title">Квартира</h5>
                                                <input type="text" className="order-details__input" value={apartment} onChange={(e) => setApartment(e.target.value)}/>
                                            </div>
                                        </div>
                                    </div>
                                : ''
                            }
                            <div className="cart-page__create-order" onClick={placeOrderClick}>
                                {isPlacingOrder ? 'Подтвердить заказ' : 'Оформить заказ'}
                            </div>
                        </>
                    : ''
                : ''
            }
        </div>
    )
}

export default CartPage;