import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { IProductCard } from "../schemas/productcard";
import ProductCard from "../components/ProductCard";
import '../styles/ProductsPage.scss';

const SearchPage: React.FC = () => {
    const { pattern } = useParams<{ pattern: string}>();
    const [products, setProducts] = useState<IProductCard[] | null>(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/products/search/${pattern}`).then(response => {
            const data = response.data;
            setProducts(data);
          })
          .catch(error => {});
    }, []);

    return (
        <div className="products-page container">
            <h1>Результат поиска по запросу: {pattern}</h1>
            <div className="products">
                {
                    products ?
                        products.length == 0 ?
                            <h1 className="products-page__title">Товары не найдены</h1>
                        : products.map(product => <ProductCard {...product}/>)
                    : <h1 className="products-page__title">Загрузка...</h1>
                } 
            </div>
        </div>
    )
}

export default SearchPage;