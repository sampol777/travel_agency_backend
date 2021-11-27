const braintree = require("braintree")
const express = require("express");
const router = new express.Router();
const {MERCHANT_ID, PUBLIC_KEY, PRIVATE_KEY} = require("../config");





router.get('/initializeBraintree', async function (req,res,next) {
    try{
        const gateway =new braintree.BraintreeGateway({
            "environment": braintree.Environment.Sandbox,
            "merchantId": MERCHANT_ID,
            "publicKey": PUBLIC_KEY,
            "privateKey": PRIVATE_KEY
        });
        let token = (await gateway.clientToken.generate({})).clientToken;
        res.send({data: token});
    }catch (err) {
      return next(err)
    }
});

router.post('/makePayment', async function (req, res, next) {
    try{
        console.log("heeereeeeeeeeeee")
        const gateway =new braintree.BraintreeGateway({
            "environment": braintree.Environment.Sandbox,
            "merchantId": MERCHANT_ID,
            "publicKey": PUBLIC_KEY,
            "privateKey": PRIVATE_KEY
        });
        const data = req.body;
        
        let data1 = {
            amount: data.data.amount,
            paymentMethodNonce: data.data.payment_method_nonce,
            options: {
                submitForSettlement: true
              }
        }
        
        let transactionResponse = await gateway.transaction.sale(data1);
        res.send({data: transactionResponse});
    }catch(err){
        return next(err);
    }
})

module.exports= router;