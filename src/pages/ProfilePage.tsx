import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

import closeIcon from '../images/close.svg';
import { IOrder } from "../schemas/order";
import '../styles/ProfilePage.scss';


interface OrderItem {
    name: string,
    brand: string,
    imageUrl: string,
    quantity: number,
    price: number
}

interface OrderData {
    items: OrderItem[] | null | undefined,
    totalPrice: number | undefined
}

interface OrderPopupProps extends OrderData {
    setIsPopupOpened: (data: any) => void;
}

const OrderPopup: React.FC<OrderPopupProps> = ({items, totalPrice, setIsPopupOpened}) => {

    const close = () => {
        setIsPopupOpened(false);
    }

    return(
        <div className="popup-wrapper" onClick={(e) => {
            if(e.target === e.currentTarget) close();
        }}>
            <div className="order-popup">
                <div className="order-popup__row">
                    <h1 className="order-popup__title">Содержимое заказа</h1>
                    <img className="order-popup__close" src={closeIcon} alt="close" onClick={close}/>
                </div>
                {
                    items?.map(item => <div className="order-item">
                        <div className="order-item__column image-column">
                            <img className="order-item__image" src={item.imageUrl} alt="product" />
                        </div>
                        <div className="order-item__column name-column">
                            <p className="order-item__title">{item.name} {item.quantity > 1 ? `(X${item.quantity})` : ''}</p>
                            <p className="order-item__brand"><b>{item.brand}</b></p>
                        </div>
                        <div className="order-item__column price-column">
                            <h1 className="order-item__price">{item.price} BYN</h1>
                        </div>
                        <hr />
                    </div>)
                }
                <div className="order-popup__row">
                    <h1 className="order-popup__total">Итого: {totalPrice} BYN</h1>
                    <div className="order-popup__ok-btn" onClick={close}>
                        Понятно
                    </div>
                </div>
            </div>
        </div>
    )
}

interface OrderCardProps extends IOrder {
    setIsPopupOpened: (data: any) => void;
    setOrderData: (data: OrderData | null) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
    id,
    amountOfProducts,
    date,
    totalPrice,
    setIsPopupOpened,
    setOrderData
}) => {
    const navigate = useNavigate();

    const showOrderPopup = () => {
        let token = Cookies.get('token');
        if (!token) {
            navigate(`/login`);
        }
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/orders/s/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }}).then(response => {
            const data = response.data;
            setOrderData(data);
            setIsPopupOpened(true);
          })
          .catch(error => {});
    }

    return(
        <div className="order-card" onClick={showOrderPopup}>
            <div className="order-card__column">
                <h3 className="order-card__number">Заказ №{id}</h3>
                <span className="order-card__price">{totalPrice} BYN, {amountOfProducts} товара</span>
            </div>
            <div className="order-card__column">
                <span className="order-card__date">{date}</span>
            </div>
        </div>
    )
}



const ProfilePage: React.FC = () => {
    const [orders, setOrders] = useState<IOrder[] | null>(null);
    
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isOrderPopupOpened, setIsOrderPopupOpened] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        let token = Cookies.get('token');
        if (!token) {
            navigate(`/login`);
        }
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/orders/get`, {
            headers: {
              Authorization: `Bearer ${token}`
            }}).then(response => {
            const data = response.data;
            setOrders(data);
          })
          .catch(error => {});
    }, []);

    return(
        <div className="profile-page container">
            {
                isOrderPopupOpened  && orderData ?
                    <OrderPopup items={orderData?.items} totalPrice={orderData?.totalPrice} setIsPopupOpened={setIsOrderPopupOpened}/>
                : ''
            }
            <h1 className="title">История заказов</h1>
            <div className="orders-container">
            {
                orders ?
                orders.length == 0 ?
                        <h1>У вас пока нет заказов</h1>
                    :  orders.map(order => <OrderCard {...order} setIsPopupOpened={setIsOrderPopupOpened} setOrderData={setOrderData}/>)
                : <h1>Загрузка...</h1>
            }
            </div>
        </div>
    )
}

export default ProfilePage;