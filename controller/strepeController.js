const express = require('express');
const app = express();
const catchAsynError = require('../middleware/asyncFetchError');
const Order = require('../models/orderModel');
const QRCode = require('qrcode')

let generateQrcode = async (customer, data) => {
    let qrcodeimg = '';
    let cartItem = JSON.parse(customer.metadata.cart)

    console.log('order create--')
    //paymet status
    //cx name
    //qty
    //eventt name

    datatable = `
    <table>
        <tr>
            <th>Customer Name</th>
            <th>Event Name</th>
            <th>Paymet status</th>
            <th>qty</th>
        </tr>
        <tr>
            <td>${qrcodeimg}</td>
            <td>Maria Anders</td>
            <td>Germany</td>
        </tr>
        
    </table>
    `;

    // QRCode.toDataURL('I am a pony!', function (err, url) {
    //     console.log(url)
    //     qrcodeimg = url
    // })
    console.log(customer.metadata.userid, 'customer.metadata.userid')
    try {
        await Order.create({
            userId: customer.metadata.userid,
            customerid: customer.id,
            // qrcode: qrcodeimg,
            paymentintentid: data.payment_intent,
            items: cartItem,
            subtotal: +data.amount_subtotal,
            total: +data.amount_total,
            payment_status: data.payment_status,
            shipping: data.customer_details,
        })
        // await User.findOneAndUpdate({
        //     _id: customer.metadata.userid
        // }, { qrcode: qrcodeimg, paymentstatus: data.payment_status }, { new: true })

    } catch (err) {
        console.log(err)
    }



};





let endpointSecret = ''
// let endpointSecret = 'whsec_7bdb13a5418f0ca55ac8b17cba9fa48d41949e81cd2fcbab6d906a98726ca3aa'
const stripe = require('stripe')(process.env.STRIPE_SECURITY_KEY)

module.exports = {
    stripeSession: async (req, res) => {
        let { cartitems, userid } = req.body;

        console.log('userid--', userid)
        console.log('stripe--', cartitems)
        const customer = await stripe.customers.create({
            metadata: {
                userid: userid, cart: JSON.stringify(cartitems)
            }
        });

        console.log(customer, 'customer--pymnet')

        const session = await stripe.checkout.sessions.create({
            line_items: cartitems,
            customer: customer.id,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/cart`,
            cancel_url: `${process.env.CLIENT_URL}`,
            // cancel_url: `${process.env.CLIENT_URL}/paycancel`,
        });

        // console.log('stripe--', session)
        res.send({ session: session });
    },
    stripeWebhook: (req, res) => {
        const payload = req.body;
        const sig = req.headers['stripe-signature'];
        let eventType = ''

        let event;

        if (endpointSecret) {
            try {
                event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
            } catch (err) {
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }
            data = event.data.object;
            eventType = event.type;

        } else {
            data = payload.data.object;
            eventType = payload.type;
        }

        // Handle the checkout.session.completed event
        if (eventType === 'checkout.session.completed') {
            console.log('webhook--session---1111111111111111')
            stripe.customers.retrieve(data.customer).then((customer) => {
                console.log('customer--enter')
                generateQrcode(customer, data)
            }).catch((err) => {
                console.log(err);
            })
            // Fulfill the purchase...
            // fulfillOrder(session);
        }

        res.status(200);
    },
    getCustomer: catchAsynError(async (req, res, next) => {
        const customer = await stripe.customers.retrieve(
            'cus_MZGxAiKPC02DDa'
        );

        res.send(customer)
    }),
    getPaymnet: catchAsynError(async (req, res, next) => {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            'pi_3Lq8UVSG9BssoxUJ1J0BQMOc'
        );

        res.send(paymentIntent)
    }),
}

