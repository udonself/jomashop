import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ItemPage from './pages/ItemPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/globals.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <BrowserRouter basename="">
        <Routes>
          <Route path="/" Component={MainPage}/>
          <Route path="/login" Component={LoginPage}/>
          {/* <Route path="/item" Component={ItemPage}/> */}
          <Route path="/products" Component={ProductsPage}/>
          <Route path="/category/:categoryId" Component={ProductsPage}/>
          <Route path="/products/:productId?" Component={ItemPage} />
          <Route path="/cart" Component={CartPage} />
          <Route path="/profile" Component={ProfilePage}/>
          <Route path="/products/search/:pattern" Component={SearchPage}/>
          {/* <Route path="/products/search/:searchQuery" Component={ProductsPage} /> */}
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
