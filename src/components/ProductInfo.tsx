import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

import { Link } from "react-router-dom";

import { IProductInfo } from "../schemas/productinfo";
import '../styles/ProductInfo.scss';

const ProductInfo: React.FC<IProductInfo> = ({id, name, description, brand, price, imageUrl}) => {
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