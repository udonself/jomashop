import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

import { IOrder } from "../schemas/order";
import '../styles/ProfilePage.scss';


const OrderCard: React.FC<IOrder> = ({id, amountOfProducts, date, totalPrice}) => {
    return(
        <div className="order-card">
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
            <h1 className="title">История заказов</h1>
            <div className="orders-container">
            {
                orders ?
                orders.length == 0 ?
                        <h1>У вас пока нет заказов</h1>
                    :  orders.map(order => <OrderCard {...order}/>)
                : <h1>Загрузка...</h1>
            }
            </div>
        </div>
    )
}

export default ProfilePage;