import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import Cookies from "js-cookie";

import logo from '../icons/logo.png';
import profileIcon from '../icons/profile-icon.svg';
import likeIcon from '../icons/like-icon.svg';
import cartIcon from '../icons/cart-icon.svg';
import searchIcon from '../icons/search-icon.svg';
import '../styles/Header.scss';
import { setCount } from '../store/store';

interface Cart {
    count: number;
}  

const Header: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const dispatch = useDispatch();
    const cartItemsAmount = useSelector((state: any) => state.cart.count);

    const searchProducts = () => {
        if(searchText.length < 1) return;

        window.location.href = `${window.location.origin}/products/search/${searchText}`;
    }

    useEffect(() => {
        let token = Cookies.get('token');
        if (!token) {
            return;
        }
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/carts/amountOfItems`, {
            headers: {
              Authorization: `Bearer ${token}`
            }}).then(response => {
            const amount = response.data;
            console.log(amount);
            dispatch(setCount(amount));
          })
          .catch(error => console.log(error));
    }, []);

    return (
        <header className="header">
            <div className="header__blacktop">
                <div className="container blacktop-content">
                    <p id="go-shopping">
                        Приступай к покупкам - <a href='/'><u>ТОВАРЫ</u></a>
                    </p>
                    <p id="callus">
                        Звоните (29) 284 56 23
                    </p>
                </div>
            </div>
            <div className="header__navline container">
                <a href='/'>
                    <img
                        className="logo"
                        src={logo}
                        alt="logo"
                    />
                </a>
                
                <div className="searh-container">
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Название продукта или бренда..."
                        onChange={(e) => {
                            setSearchText(e.target.value)
                            }
                        }
                        onKeyDown={(e) => {
                            if(e.key === "Enter")
                                searchProducts()
                        }}
                    />
                    <img id='search-icon' src={searchIcon} alt="search" onClick={searchProducts}/>
                </div>
                <div className="navicons">
                    <a href='/profile'>
                        <img src={profileIcon} alt="profile" />
                    </a>
                    {/* <img src={likeIcon} alt="like" /> */}
                    <a className="cart" href='/cart'>
                        <img src={cartIcon} alt="cart" />
                        {
                            cartItemsAmount > 0 ? 
                                <div className="cart__amount">
                                    {cartItemsAmount}
                                </div>
                            : ''
                        }
                    </a>
                    
                </div>
            </div>
        </header>
    )
}

export default Header;