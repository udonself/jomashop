import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import CategoryCard from "../components/CategoryCard";

import { ICategory } from "../schemas/category";
import promotionImage from '../images/promo.jpg';
import '../styles/MainPage.scss';

const MainPage: React.FC = () => {
    const [categories, setCategories] = useState<ICategory[] | null>(null);
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/categories/get`).then(response => {
            const data = response.data;
            setCategories(data);
          })
          .catch(error => {});
    }, []);

    return (
        <div className="main-page container">
            <img
                className="promotion-image"
                src={promotionImage}
                alt="promotion"
            />
            <div className="categories">
                {
                    categories ? 
                        categories.map(
                            (category) => <CategoryCard {...category}/>
                        )
                    :
                    <div className="category-loader">
                        <div className="loader"></div>
                    </div>
                }
            </div>
        </div>
    )
}

export default MainPage;