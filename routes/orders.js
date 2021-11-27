"use strict"

/** Routes for cart and booking */

const express = require("express");

const {BadRequestError} = require("../expressError");
const Order = require("../models/order")


const router = new express.Router();

/** submit order */

router.post("/", async function (req, res, next){
    try {
        console.log(req.body)
        const addOrder = await Order.create(req.body)
        return res.status(201).json({addOrder});
      }catch (err) {
          return next(err);
      }
})

/**get all orders for user */

router.get("/user/:username", async function(req, res, next){
    try {
      console.log(req.params.username)
      const orders = await Order.getOrdersUser(req.params.username)
      return res.status(201).json(orders);
    }catch (err) {
        return next(err);
    }
})

/** get all orders for partner */

router.get("/partner/:username", async function(req, res, next){
    try {
      const orders = await Order.getOrdersPartner(req.params.username)
      return res.status(201).json(orders);
    }catch (err) {
        return next(err);
    }
})


module.exports = router;