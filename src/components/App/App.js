import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import Product from '../Product/Product';

import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatPrice = useCallback((price) => {
    if (price.endsWith('00')) {
      return Math.floor(price);
    } else return price;
  });

  useEffect(() => {
    const getDataFromDB = async () => {
      setLoading(true);
      const { data } = await axios.get('/api/cart');
      setProducts(data);
      setLoading(false);
    };
    getDataFromDB();
  }, []);

  if (loading) {
    return (
      <div className='container'>
        <h3>Lista produktów</h3>
        <span>Ładowanie produktów...</span>
      </div>
    );
  }

  return (
    <div className='container'>
      <h3>Lista produktów</h3>
      <ul>
        {products.map((product) => (
          <li key={product.pid} className='row'>
            <span>
              {' '}
              {product.name}, cena: {formatPrice(product.price)}zł
            </span>
            <Product product={product} setProducts={setProducts} />
          </li>
        ))}
      </ul>
      <h4>
        Suma koszyka:{' '}
        {products.reduce((acc, val) => acc + val.price * val.qty, 0).toFixed(2)}{' '}
        złotych
      </h4>
    </div>
  );
};

export { App };
