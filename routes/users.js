"use strict";

/** Routes for users */


const jsonschema = require("jsonschema");
 
const express = require("express");
const {ensureCorrectUser} = require("../middleware/auth");
const {BadRequestError} = require("../expressError");
const User = require("../models/user");

const userUpdateSchema = require("../schemas/userUpdate.json");


const router = express.Router();

/** GET /[username] => {user}
 * 
 * Returns {username, firstName, lastName, email}
 * 
 * authorization: ensureCorrectUser
 */

router.get("/:username",  async function (req, res, next){
    try {
      const user = await User.get(req.params.username);
      return res.json({user});
    }catch(err){
      return next(err);
    }
});


/** PATCH /[username] {user} => {user}
 * 
 * Data can include:
 * {firstName, lastName, password, email}
 * 
 * Returns {username, firstName, lastName, email, isAdmin}
 * 
 * Authorization required:same-user-as: username
 */

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user});
    }catch (err) {
        return next(err);
    }
})

router.patch("/:username/delete",  ensureCorrectUser,async function (req, res, next) {
    try {
        const user = await User.remove(req.params.username)
        return res.json("success")
    } catch (err) {
        return next(err);
    }
})

module.exports = router;