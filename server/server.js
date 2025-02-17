const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('public'))
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
    [
        1, { priceInRs: 10000, name: "React Course" }
    ],
    [
        2, {priceInRs: 20000, name: "Python Course"}
    ]
])

app.post('/create-checkout-session', async (req,res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            mode : 'payment',
            line_items : req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data : {
                        currency : 'usd',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount : storeItem.priceInRs
                    },
                    quantity : item.quantity,

                }
            }), //called it items bec we have saved it so in script.js
            success_url : `${process.env.SERVER_URL}/success.html`,
            cancel_url : `${process.env.SERVER_URL}/cancel.html`
        })
    res.json({ url: session.url})
    } catch{
        res.status(500).json({error : e.message})
    }
})

app.listen(3000) 