"use strict"

/** Routes for cart and booking */

const express = require("express");

const {BadRequestError} = require("../expressError");
const Cart = require("../models/cart")
const Booking = require("../models/booking")

const router = new express.Router();

/** GET /[username] => {cart} */


router.get("/:username", async function (req, res, next) {
    try {
      const cart = await Cart.get(req.params.username);
      console.log()
      return res.json({cart});
    }catch(err) {
        return next(err);
    }
});


/** add booking to cart */

router.post("/addtocart", async function (req, res, next){
    try {
      const addtocart = await Booking.create(req.body)
      return res.status(201).json({addtocart});
    }catch (err) {
        return next(err);
    }


});

router.delete("/bookings/:id",async function (req, res, next) {
  try {
    const booking = await Booking.remove(req.params.id);
    return res.json({booking});
  }catch(err) {
      return next(err);
  }
});

router.delete("/", async function (req, res, next) {
  try{
    const cart= await Cart.clear(req.body.ids);
    return res.json({cart})
  }catch(err){
    return next(err)
  }
})


module.exports = router;