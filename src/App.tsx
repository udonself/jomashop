import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import ItemPage from './pages/ItemPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/globals.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" Component={MainPage}/>
          <Route path="/item" Component={ItemPage}/>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
