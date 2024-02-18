import React from "react";
import { Link } from "react-router-dom";

import { IProductCard } from "../schemas/productcard";
import '../styles/ProductCard.scss';

const ProductCard: React.FC<IProductCard> = ({id, imageUrl, brand, name, price}) => {
    return (
        <Link to={`/products/${id}`} className="product-card">
            <img
                className="product-card__image"
                src={imageUrl}
                alt={name}
            />
            <span className="product-card__brand">{brand}</span>
            <span className="product-card__name">{name}</span>
            <span className="product-card__price">{price} BYN</span>
        </Link>
    )
}

export default ProductCard;
