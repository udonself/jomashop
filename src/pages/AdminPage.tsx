import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import { IShortProductInfo } from "../schemas/shortproduct";
import downloadImage from '../images/download.svg';
import '../styles/AdminPage.scss';

function isDigit(str: string) {
    return /^\d+$/.test(str);
 }

const AdminPage: React.FC = () => {

    // add product stock
    const [products, setProducts] = useState<IShortProductInfo[]>([]);
    const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
    const [amountToAdd, setAmountToAdd] = useState<string>('');
    const [sSuccessMsg, setSSuccessMsg] = useState<string>('');
    const [sErrorMsg, setSErrorMsg] = useState<string>('');

    // change order status
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string>('');
    const [oSuccessMsg, setOSuccessMsg] = useState<string>('');
    const [oErrorMsg, setOErrorMsg] = useState<string>('');


    // date
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndtDate] = useState<string>('');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/products/all`).then(response => {
            const data = response.data;
            setProducts(data);
            setSelectedShortId(data[0].id);
          })
          .catch(error => {});
    }, []);

    const handleInputChange = (newText: string) => {
        setOSuccessMsg('');
        setOErrorMsg('');
        setOrderId(newText);
    }

    const handleAmountInputChange = (newText: string) => {
        setSSuccessMsg('');
        setSErrorMsg('');
        setAmountToAdd(newText);
    }

    const changeStatus = () => {
        setOSuccessMsg('');
        setOErrorMsg('');
        if(!isDigit(orderId)){
            setOErrorMsg('Введите корректный номер заказа!');
            return;
        }
        else if(!selectedStatus){
            setOErrorMsg('Выберите статус заказа!');
            return;
        }
        let token = Cookies.get('token');
        if (!token) {
            setOErrorMsg(`Авторизуйтесь...`);
        }
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const data = {
            order_id: orderId,
            status: selectedStatus
        };
        axios.post(`${process.env.REACT_APP_BASE_API_URL}/orders/change_status`, data, { headers })
        .then(response => {
            setOSuccessMsg(response.data.detail);
        })
        .catch(error => {
            // console.log(error);
            setOErrorMsg(error.response.data.detail);
        });
    }

    const AddStock = () => {
        setSSuccessMsg('');
        setSErrorMsg('');
        if(!selectedShortId) {
            setSErrorMsg('Выберите товар!');
            return;
        }
        else if(!isDigit(amountToAdd)){
            setSErrorMsg('Введите корректное количество!');
            return;
        }
        let token = Cookies.get('token');
        if (!token) {
            setSErrorMsg(`Авторизуйтесь...`);
        }
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        const data = {
            product_id: selectedShortId,
            amount_to_add: amountToAdd
        };
        axios.post(`${process.env.REACT_APP_BASE_API_URL}/products/add_stock`, data, { headers })
        .then(response => {
            setSSuccessMsg(response.data.detail);
        })
        .catch(error => {
            // console.log(error);
            setSErrorMsg(error.response.data.detail);
        });
    }

    return (
        <div className="admin-page container">
            <div className="panel">
                <h1 className="panel__title">Изменить статус заказа</h1>
                <input placeholder="Номер заказа" className="panel__input" type="text" required value={orderId} onChange={(e) => handleInputChange(e.target.value)}/>
                <div className="panel__status-selector">
                    <span className={`panel__spec-status completed ${selectedStatus == 'completed' ? 'selected' : ''}`} onClick={() => setSelectedStatus('completed')}>Доставлен</span>
                    <span className={`panel__spec-status inprogress ${selectedStatus == 'in progress' ? 'selected' : ''}`} onClick={() => setSelectedStatus('in progress')}>В обработке</span>
                    {/* <span className={`panel__spec-status canceled ${selectedStatus == 'canceled' ? 'selected' : ''}`} onClick={() => setSelectedStatus('canceled')}>Отменить</span> */}
                </div>
                <div>
                    <div className="panel__btn" onClick={changeStatus}>Изменить статус</div>
                    {oSuccessMsg.length > 0 ? <span className="succes-msg">{oSuccessMsg}</span> : ''}
                    {oErrorMsg.length > 0 ? <span className="error-msg">{oErrorMsg}</span> : ''}
                </div>
            </div>
            <div className="panel">
                <h1 className="panel__title">Пополнить наличие</h1>
                <select className="panel__input" onChange={(e) => {
                    let selectedIndex = e.target.selectedIndex;
                    let selectedShortId = e.target.options[selectedIndex].value;
                    // console.log(selectedShortId);
                    setSelectedShortId(selectedShortId);
                }}>
                    {products.map(product =>
                            <option
                                value={`${product.id}`}
                            >
                                {product.name}
                            </option>
                        )
                    }
                </select>
                <input placeholder="Количество" className="panel__input" type="text" value={amountToAdd} onChange={(e) => handleAmountInputChange(e.target.value)}/>
                <div>
                    <div className="panel__btn" onClick={AddStock}>Пополнить</div>
                    {sSuccessMsg.length > 0 ? <span className="succes-msg">{sSuccessMsg}</span> : ''}
                    {sErrorMsg.length > 0 ? <span className="error-msg">{sErrorMsg}</span> : ''} 
                </div>
            </div>
            <div className="panel">
                <h1 className="panel__title">Получить отчет</h1>
                <div className="panel__dateline">
                    <div className="panel__datecol">
                        <p className="panel__datetitle">С</p>
                        <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="panel__dateinput"/>
                    </div>
                    <div className="panel__datecol">
                        <p className="panel__datetitle">До</p>
                        <input value={endDate} onChange={(e) => setEndtDate(e.target.value)} type="date" className="panel__dateinput"/>
                    </div>
                </div>
                <a className="download-btn" href={`${process.env.REACT_APP_BASE_API_URL}/orders/xlsx/sales/${startDate}/${endDate}`} download>
                    <div className="panel__btn">
                        Кол-во продаж и остаток <img className="download" src={downloadImage} alt="" />
                    </div>
                </a>
                <a className="download-btn" href={`${process.env.REACT_APP_BASE_API_URL}/orders/xlsx/orders/${startDate}/${endDate}`} download>
                    <div className="panel__btn">
                        Детализация заказов <img className="download" src={downloadImage} alt="" />
                    </div>
                </a>
                <a className="download-btn" href={`${process.env.REACT_APP_BASE_API_URL}/orders/xlsx/repleishments/${startDate}/${endDate}`} download>
                    <div className="panel__btn">
                        Пополнения <img className="download" src={downloadImage} alt="" />
                    </div>
                </a>
                <a className="download-btn" href={`${process.env.REACT_APP_BASE_API_URL}/orders/xlsx/repleishments_sum/${startDate}/${endDate}`} download>
                    <div className="panel__btn">
                        Сумма пополнений <img className="download" src={downloadImage} alt="" />
                    </div>
                </a>
            </div>
        </div>
    )
}

export default AdminPage;