import React from "react";
import { Link } from "react-router-dom";

import { Category } from "../schemas/category";
import '../styles/CategoryCard.scss';

const CategoryCard: React.FC<Category> = ({id, imageUrl, name}) => {
    return (
        <Link to={`category/${id}`} className="category-card">
            <img className="category-card__image" src={imageUrl} alt="category" />
            <p className="category-card__name">{name}</p>
        </Link>
    )
}

export default CategoryCard;