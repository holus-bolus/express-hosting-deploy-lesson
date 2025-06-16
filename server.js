const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {apiVersion:'2023-10-16'});
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
})

app.post('/create-checkout-session', async(req, res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items: req.body.items.map(item=>({
                price_data:{
                    currency:'usd',
                    product_data:{
                        name: item.name
                    },
                    unit_amount: item.price*100
                },
                quantity:item.quantity,
            })),
            success_url:'http://localhost:5173/success',
            cancel_url:'http://localhost:5173/cancel',
        })
        res.json({url: session.url});
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            message:err.message
        })
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})