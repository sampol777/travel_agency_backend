"use strict"

/** Routes for trips */

const jsonschema = require("jsonschema");
const express = require("express");

const {BadRequestError} = require("../expressError");
const {ensureCorrectUser} = require("../middleware/auth");
const Trip = require("../models/trip");

const tripNewSchema = require("../schemas/tripNew.json")
const tripUpdateSchema = require("../schemas/tripUpdate.json");
const tripSearchSchema = require("../schemas/tripSearch.json");

const router = new express.Router();


/** POST / {trip} => { trip} 
 * 
 * trip should be { destination,partnername, numOfNights, all_inclusive, pricePP}
 * 
 * Returns {id, destination,partnername, numOfNights, all_inclusive, pricePP}
 * 
*/

router.post("/", async function (req,res,next){
    try{
      const validator = jsonschema.validate(req.body, tripNewSchema);
      if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
      }
      
      const trip = await Trip.create(req.body);
      return res.status(201).json({trip});
    }catch (err) {
       return next(err);
    }
});

/** GET / =>
 * {trips:[{id, destination,partnername, numOfNights, all_inclusive, pricePP }]}
 * 
 * Can filter on provided search filters:
 * -destination
 * -partnername
 * -numOfNights
 * -allInclusive
 * -minprice
 * -maxprice
 * 
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  //arrive as strings from querystring, but we want as ints
  if (q.numOfNights !== undefined ) q.numOfNights = +q.numOfNights;
  if (q.minPrice !== undefined ) q.minPrice = +q.minPrice;
  if (q.maxPrice !== undefined ) q.maxPrice = +q.maxPrice;

  try {
    const validator = jsonschema.validate(q, tripSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e=> e.stack);
      throw new BadRequestError(errs);
    }

    const trips = await Trip.findAll(q);
    return res.json({trips});
  }catch (err) {
    return next(err);
  }
});

/** GET /[id] => {trip}
 * 
 * Trip is {id, destination,partnername, numOfNights, all_inclusive, pricePP }
 * 
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const trip = await Trip.get(req.params.id);
    return res.json({trip})
  }catch (err) {
    return next(err);
  }
});

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tripUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const trip = await Trip.update(req.params.id, req.body );
    return res.json({ trip})
  }catch (err) {
    return next(err);
  }
});

/** remove trip */

router.patch("/:id/delete", async function (req, res, next){
  try{
  console.log(req.params.id)
  const trip = await Trip.deletePartnerTrip(req.params.id);
    return res.json("success")
  }catch (err) {
    return next(err);
  }
})

/** get partner trips */

router.get("/partner/:username", async function (req, res, next){
  try {
    const partner =await Trip.getPartnerTrips(req.params.username);
    return res.json(partner)
  } catch (err) {
    return next(err);
  }
})


module.exports= router;