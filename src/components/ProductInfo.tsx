import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';

import { Link } from "react-router-dom";

import { IProductInfo } from "../schemas/productinfo";
import { setCount } from '../store/store';
import '../styles/ProductInfo.scss';

const ProductInfo: React.FC<IProductInfo> = ({id, name, description, brand, price, imageUrl, inStock}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cartAmount, setCartAmount] = useState<number | null>(null);
    
    const [error, setError] = useState<string | null>(null);

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
            const data = response.data;
            setCartAmount(data.new_quantity);
            dispatch(setCount(data.total_items));
        })
        .catch(e => {});
    }

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
            console.log(data);
            setCartAmount(data.new_quantity);
            dispatch(setCount(data.total_items));
            setError(null);
        })
        .catch(e => {
            setError(e.response.data.detail.message);
            setCartAmount(e.response.data.detail.new_quantity);
        });
    }

    useEffect(() => {
        let token = Cookies.get('token');
        if (!token) {
            navigate(`/login`);
        }
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/carts/cartAmount/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }}).then(response => {
            const data = response.data;
            setCartAmount(data.amount);
        })
    }, []);
    
    return (
        <div className="product-info">
            <div className="product-info__column">
                <img className="product-info__image" src={imageUrl} alt="product" />
            </div>
            <div className="product-info__column info-column">
                <span className="product-info__stock">{
                    inStock === 0 ? 'Нет в наличии' : `В наличии: ${inStock}`
                }</span>
                <div className="product-info__data">
                    <h1 className="product-info__brand">{brand}</h1>
                    <h5 className="product-info__title">Название</h5>
                    <p className="product-info__name">{name}</p>
                    <h5 className="product-info__title">Описание</h5>
                    <p className="product-info__description">{description}</p>
                </div>
                <div style={{display: 'flex'}}>
                    {
                        cartAmount ? 
                            cartAmount > 0 ?
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    
                                    <div className="quantity-changer">
                                        <span className="quantity-changer__action" onClick={() => addQuantity(-1)}>-</span>
                                        <span className="quantity-changer__value">{cartAmount}</span>
                                        <span className="quantity-changer__action" onClick={() => addQuantity(1)}>+</span>
                                    </div><span className={`${error ? 'error' : ''}`} style={{fontSize: '20px', color: '#A5A5A5'}}>{error ? error : 'Товар в корзине'}</span>
                                </div>
                            : <div className="add-to-cart-btn" onClick={addToCart}>Добавить в корзину</div>
                        : <div className="add-to-cart-btn" onClick={addToCart}>Добавить в корзину</div>
                    }
                    {/* <span className={`${error ? 'error' : ''}`}>{error ? error : ''}</span> */}
                </div>
            </div>
        </div>
    )
}

export default ProductInfo;