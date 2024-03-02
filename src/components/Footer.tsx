import React from "react";

import '../styles/Footer.scss';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer__content container">
                <div className="footer__column">
                    <p className="footer__title">Свяжитесь с нами</p>
                    <p className="footer__subtitle">Сервис</p>
                    <p className="footer__subtitle">Статус заказа</p>
                    <p className="footer__subtitle">Продать часы</p>
                    <p className="footer__subtitle">Стать поставщиком</p>
                </div>
                <div className="footer__column">
                    <p className="footer__title">Информация о компании</p>
                    <p className="footer__subtitle">Про JomaShop</p>
                    <p className="footer__subtitle">Отзывы</p>
                    <p className="footer__subtitle">Наш блог</p>
                    <p className="footer__subtitle">Наше приложение</p>
                </div>
                <div className="footer__column">
                    <p className="footer__title">Центр помощи</p>
                    <p className="footer__subtitle">Информация о заказе</p>
                    <p className="footer__subtitle">Настройки заказа</p>
                    <p className="footer__subtitle">Способы оплаты</p>
                    <p className="footer__subtitle">Олпатить crypto</p>
                </div>
                <div className="footer__column">
                    <p className="footer__title">Возврат & гарантия</p>
                    <p className="footer__subtitle">Сервис возврата</p>
                    <p className="footer__subtitle">Политика гарантии</p>
                    <p className="footer__subtitle">Центр помощи</p>
                    <a href={`${process.env.REACT_APP_BASE_API_URL}/orders/xlsx_report`} download>report</a>
                    {/* <p className="footer__subtitle">Продление гарантии</p> */}
                </div>
            </div>
        </footer>
    )
}

export default Footer;