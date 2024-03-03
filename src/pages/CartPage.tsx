import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';

import { ICartProduct } from "../schemas/cart";
import { setCount } from '../store/store';
import CartProduct from "../components/CartProduct";
import '../styles/CartPage.scss';

const CartPage: React.FC = () => {
    const dispatch = useDispatch();

    const [cartProducts, setCartProducts] = useState<ICartProduct[] | null>(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

    const [isDiscount, setIsDiscount] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number | null> (null);

    // order details
    const [phone, setPhone] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [house, setHouse] = useState<string>('');
    const [apartment, setApartment] = useState<string>('');

    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const placeOrderClick = () => {
        if(!isPlacingOrder){
            setIsPlacingOrder(true);
            return;
        }
        if(!/^\+{0,1}375(17|25|29|33|44)\d{7}$/.test(phone)){
            setError('Некорректный номер телефона!');
            return;
        }
        else if(city.length == 0){
            setError('Введите город!');
            return;
        }
        else if(street.length == 0){
            setError('Введите улицу!');
            return;
        }
        else if(!/\d/.test(house)){
            setError('Введите корректный номер дома!');
            return;
        }
        else if(!/\d/.test(apartment)){
            setError('Введите корректный номер квартиры!');
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
            dispatch(setCount(0));
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
            calculateTotalPrice(data);
            setCartProducts(data);
        })
        .catch(error => {});

        axios.get(`${process.env.REACT_APP_BASE_API_URL}/carts/amountOfItems`, {
            headers: {
                Authorization: `Bearer ${token}`
            }}).then(response => {
            const amount = response.data;
            console.log(amount);
            dispatch(setCount(amount));
        })
        .catch(error => console.log(error));
    }

    const calculateTotalPrice = (products: ICartProduct[]) => {
        let price = products?.map(p => p.totalPrice).reduce((sum, current) => sum + current, 0);
        setTotalPrice(price);
        if (price >= 100) {
            setIsDiscount(true);
            return;
        }
        setIsDiscount(false);
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
                            <b className="cart-page__total-price">Итого:&nbsp;{
                                isDiscount ?
                                    <div>
                                        <s>{totalPrice}</s> {totalPrice ? Math.floor(totalPrice - totalPrice * 0.1) : ''}
                                    </div>
                                : totalPrice
                            } BYN</b>
                            {
                                isPlacingOrder ? 
                                    <div className="order-details">
                                        
                                        <div className="order-details__row row2">
                                            <div className="order-details__column column2">
                                                <h5 className="order-details__title">Телефон</h5>
                                                <input placeholder="+375291921837" type="text" className="order-details__input" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                                            </div>
                                            <div className="order-details__column column2">
                                                <h5 className="order-details__title">Город</h5>
                                                <input placeholder="Минск" type="text" className="order-details__input"  value={city} onChange={(e) => setCity(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="order-details__row row3">
                                            <div className="order-details__column column3">
                                                <h5 className="order-details__title">Улица</h5>
                                                <input placeholder="Кижеватова" type="text" className="order-details__input" value={street} onChange={(e) => setStreet(e.target.value)}/>
                                            </div>
                                            <div className="order-details__column column3">
                                                <h5 className="order-details__title">Дом</h5>
                                                <input placeholder="119" type="text" className="order-details__input" value={house} onChange={(e) => setHouse(e.target.value)}/>
                                            </div>
                                            <div className="order-details__column column3">
                                                <h5 className="order-details__title">Квартира</h5>
                                                <input placeholder="293" type="text" className="order-details__input" value={apartment} onChange={(e) => setApartment(e.target.value)}/>
                                            </div>
                                        </div>
                                        <span className="error">
                                            {error}
                                        </span>
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