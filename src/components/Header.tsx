import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

import logo from '../icons/logo.png';
import profileIcon from '../icons/profile-icon.svg';
import likeIcon from '../icons/like-icon.svg';
import cartIcon from '../icons/cart-icon.svg';
import searchIcon from '../icons/search-icon.svg';
import '../styles/Header.scss';
import { KeyObject } from "crypto";
import { keyboard } from "@testing-library/user-event/dist/keyboard";

const Header: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');

    const searchProducts = () => {
        if(searchText.length < 1) return;

        let searchWindow = window.open('', '_blank');
        if (searchWindow)
            searchWindow.location.href = `${window.location.origin}/products/search/${searchText}`;
    }

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
                    <a href='/cart'>
                        <img src={cartIcon} alt="cart" />
                    </a>
                    
                </div>
            </div>
        </header>
    )
}

export default Header;