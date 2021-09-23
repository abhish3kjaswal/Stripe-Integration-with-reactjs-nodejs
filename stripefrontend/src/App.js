import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

function App() {
  const [products, setProducts] = useState({
    name: 'React from FB',
    price: 10,
    productBy: 'facebook',
  });

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    //stripe only works with https not with http
    return fetch(`https://localhost:8000/payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log('Response', res);
        const { status } = res;
        console.log('Status:', status);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <StripeCheckout
          stripeKey='pk_test_51JciGHSIQnXxLiDqkVKVFsmEXweqOSTjSVO788Xbnvo0cLZLY5QSggLTeQWkqM87NqiK1yx7KKhXDYCQ5sh9XA2t00jcRmkIWe'
          token={makePayment}
          name='Buy React'
          amount={products.price * 100}
          shippingAddress
          billingAddress
        >
          <button className='btn-large pink'>
            Buy React in just {products.price}$
          </button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
