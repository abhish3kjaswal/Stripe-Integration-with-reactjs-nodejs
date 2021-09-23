const cors = require('cors');
const express = require('express');
// TODO: add a stripe key
const stripe = require('stripe')(
  'sk_test_51JciGHSIQnXxLiDqwBSZWCZVcnLweMHH4llDLGoU9KdNTfedck2UfLEazPldjVMxP7jggY6JX02EpG2mUldYRvqP00bsaa8e3j'
);
const { v4: uuidv4 } = require('uuid');

const app = express();

const port = 8000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('It works');
});

app.post('/payment', (req, res) => {
  const { product, token } = req.body;
  console.log('Product:', product);
  console.log('Price:', product.price);

  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((cust) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: 'usd',
          customer: cust.id,
          receipt_email: token.email,
          description: `Purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
              city: token.card.address_city,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
