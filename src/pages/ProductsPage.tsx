import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { IProductCard } from "../schemas/productcard";
import ProductCard from "../components/ProductCard";
import '../styles/ProductsPage.scss';

const ProductsPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string}>();
    const [category, setCategory] = useState<string>('');
    const [products, setProducts] = useState<IProductCard[] | null>(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/products/${categoryId}`).then(response => {
            const data = response.data;
            setCategory(data.category);
            setProducts(data.products);
          })
          .catch(error => {});
    }, []);

    return (
        <div className="products-page container">
            <h1>{category}</h1>
            <div className="products">
                {
                    products ?
                        products.length == 0 ?
                            <h1 className="products-page__title">Товаров пока нет</h1>
                        : products.map(product => <ProductCard {...product}/>)
                    : <h1 className="products-page__title">Загрузка</h1>
                } 
            </div>
        </div>
    )
}

export default ProductsPage;