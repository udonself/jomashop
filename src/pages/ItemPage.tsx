import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { IProductInfo } from "../schemas/productinfo";
import ProductInfo from "../components/ProductInfo";


const ItemPage: React.FC = () => {
    const { productId } = useParams<{ productId: string}>();
    const [product, setProduct] = useState<IProductInfo | null>(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/products/item/${productId}`).then(response => {
            const data = response.data;
            setProduct(data);
          })
          .catch(error => {});
    }, []);
    
    return (
        <div className="item-page container" style={{marginTop: 60, minHeight: 600}}>
            {
                product ?
                    <ProductInfo {...product}/>
                :
                <div className="centered" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="loader"></div>
                </div>
            }
            
        </div>
    )
}

export default ItemPage;