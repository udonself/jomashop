import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

import logo from '../icons/logo.png';
import profileIcon from '../icons/profile-icon.svg';
import likeIcon from '../icons/like-icon.svg';
import cartIcon from '../icons/cart-icon.svg';
import searchIcon from '../icons/search-icon.svg';
import '../styles/Header.scss';

const Header: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');

    return (
        <header className="header">
            <div className="header__blacktop">
                <div className="container blacktop-content">
                    <p id="go-shopping">
                        Приступай к покупкам - <a href='/shopping'><u>ТОВАРЫ</u></a>
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
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <img id='search-icon' src={searchIcon} alt="search" />
                </div>
                <div className="navicons">
                    <a href='/profile'>
                        <img src={profileIcon} alt="profile" />
                    </a>
                    {/* <img src={likeIcon} alt="like" /> */}
                    <a href='/cart'>
                        <img src={cartIcon} alt="cart" />
                    </a>
                    
                </div>
            </div>
        </header>
    )
}

export default Header;