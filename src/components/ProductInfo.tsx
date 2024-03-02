import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useDispatch } from 'react-redux';

import { Link } from "react-router-dom";

import { IProductInfo } from "../schemas/productinfo";
import { setCount } from '../store/store';
import '../styles/ProductInfo.scss';

const ProductInfo: React.FC<IProductInfo> = ({id, name, description, brand, price, imageUrl}) => {
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

    const addToCart = () => {
        let token = Cookies.get('token');
        if (!token) {
            navigate(`/login`);
        }
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const data = {
            id: id,
            quantity: 1
        };
        axios.post(`${process.env.REACT_APP_BASE_API_URL}/carts/add`, data, { headers })
        .then(response => {
            setIsAddedToCart(true);
        })
        .catch(error => {  });

        setTimeout(() => {
            axios.get(`${process.env.REACT_APP_BASE_API_URL}/carts/amountOfItems`, {
            headers: {
                Authorization: `Bearer ${token}`
            }}).then(response => {
            const amount = response.data;
            console.log(amount);
            dispatch(setCount(amount));
            }).catch(error => console.log(error));
        }, 300);
        
    }
    
    return (
        <div className="product-info">
            <div className="product-info__column">
                <img className="product-info__image" src={imageUrl} alt="product" />
            </div>
            <div className="product-info__column">
                <div className="product-info__data">
                    <h1 className="product-info__brand">{brand}</h1>
                    <h5 className="product-info__title">Название</h5>
                    <p className="product-info__name">{name}</p>
                    <h5 className="product-info__title">Описание</h5>
                    <p className="product-info__description">{description}</p>
                </div>
                <div>
                    <div className="add-to-cart-btn" onClick={addToCart}>
                        Добавить в корзину
                    </div>
                    {
                        isAddedToCart ?
                            <Link className="product-info__go-cart" to='/cart'>Перейти в корзину</Link>
                        : ''
                    }      
                </div>
            </div>
        </div>
    )
}

export default ProductInfo;