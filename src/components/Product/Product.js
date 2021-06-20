import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import axios from 'axios';

import './Product.css';

const Product = ({ product, setProducts }) => {
  const { min, max, isBlocked, pid } = product;
  const [productNumber, setProductNumber] = useState(1);

  const debouncedApiCheck = useDebouncedCallback(async () => {
    const { data } = await axios.post('/api/product/check', {
      pid,
      quantity: productNumber,
    });
    if (data.isError) {
      setProductNumber(min);
    }
  }, 500);

  const increaseHandler = async () => {
    setProductNumber((prevNumber) => prevNumber + 1);
    debouncedApiCheck();
  };

  const decreaseHandler = async () => {
    setProductNumber((prevNumber) => prevNumber - 1);
    debouncedApiCheck();
  };

  useEffect(() => {
    setProducts((prevProducts) => {
      const findProduct = prevProducts.find(
        (foundProduct) => foundProduct.pid === product.pid
      );
      findProduct.qty = productNumber || 1;
      return [...prevProducts];
    });
    // }
  }, [productNumber]);

  return (
    <div className='product'>
      <span>Obecnie masz {productNumber} sztuk produktu</span>
      <button
        onClick={increaseHandler}
        disabled={productNumber === max || isBlocked}
      >
        +
      </button>
      <button
        onClick={decreaseHandler}
        disabled={productNumber === min || isBlocked}
      >
        -
      </button>
    </div>
  );
};

export default Product;
