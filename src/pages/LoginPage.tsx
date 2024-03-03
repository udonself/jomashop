import React from "react";
import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import '../styles/LoginPage.scss';


const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const [isRegistration, setIsRegistration] = useState<boolean>(false);

    const [login, setLogin] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');

    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [repeatPasswordError, setRepeatPasswordError] = useState<string>('');

    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const changeMode = () => {
        setIsRegistration(!isRegistration);
        [setLogin, setPassword, setRepeatPassword, setLoginError, setPasswordError, setRepeatPasswordError].forEach(setValue => {
            setValue('');
        });
    }

    const HandleLoginClick = () => {
        if(loading) return;
        switch (isRegistration) {
            case true: { // register
                let error: boolean = false;
                if(!/^[а-яА-Яa-zA-Z0-9]{7,}$/.test(login)){
                    setLoginError('Логин должн состоять из букв или цифр и иметь длину не менее 7');
                    error = true;
                }
                if(!/^.{5,}$/.test(password)){
                    setPasswordError('Минимальная длина - 5 символов');
                    error = true;
                }
                 if(password !== repeatPassword){
                    setRepeatPasswordError('Пароли не совпадают');
                    error = true;
                }
                if(error) return;

                setLoading(true);

                let registerParams = {
                    username: login,
                    password: password
                }
                axios.post(`${process.env.REACT_APP_BASE_API_URL}/users/register`, registerParams)
                  .then(function (response) {
                    console.log(response);
                    Cookies.set('token', response.data.token);
                    navigate(`/profile`);
                })
                  .catch(function (error) {
                    if(error.response){
                        setError(error.response.data.detail);
                    }
                }).finally(() => {
                    setLoading(false);
                });

                break;
            }
            case false: { // login
                
                setLoading(true);

                let loginApiUrl = `${process.env.REACT_APP_BASE_API_URL}/users/auth`;
                let loginParams = {
                    username: login,
                    password: password
                };
                axios.get(loginApiUrl, {params: loginParams})
                .then(function (response) {
                    console.log(response);
                    Cookies.set('token', response.data.token);
                    navigate(`/`);
                })
                .catch(function (error) {
                    if(error.response){
                        // setErrorText(error.response.data.detail);
                        setError(error.response.data.detail);
                    }
                }).finally(() => {
                    setLoading(false);
                });

                break;
            }
        }
    }

    return(
        <div className="lform">
            <h1 className="lform__title">
                {isRegistration ? 'Регистрация' : 'Вход'}
            </h1>
            <span className="lform__error">{error}</span>
            <input className="lform__input" type="text" placeholder="Логин" onChange={(e) => {setLogin(e.target.value); setLoginError(''); setError('')}} value={login}/>
            <span className="lform__error">{loginError}</span>
            <input className="lform__input" type="password" placeholder="Пароль" onChange={(e) => {setPassword(e.target.value); setPasswordError(''); setError('')}} value={password}/>
            <span className="lform__error">{passwordError}</span>
            {
                isRegistration
                ?
                <>
                    <input className="lform__input" type="password" placeholder="Повтор пароля" onChange={(e) => {setRepeatPassword(e.target.value); setRepeatPasswordError(''); setError('')}} value={repeatPassword}/>
                    <span className="lform__error">{repeatPasswordError}</span>
                </>
                : ''
            }
            <div className="lform__btn" onClick={HandleLoginClick}>
                {
                    loading ?
                        <img className="lform__loader-image" src="https://telegra.ph/file/a8dd37837ec0b0713e822.gif" alt="loading" />
                    :
                        isRegistration ?
                            'Зарегистрироваться'
                        : 'Войти'
                }
            </div>
            <p className="lform__mode-changer" onClick={changeMode}>
                {
                    !isRegistration ?
                        <span>Еще нет аккаунта? <u>Зарегистрироваться</u></span>
                    :
                        <span>Уже есть аккаунт? <u>Войти</u></span>
                }  
            </p>
        </div>
    )
}


const LoginPage: React.FC = () => {
    return(
        <div className="login-page container">
            <LoginForm />
        </div>
    )
}

export default LoginPage;