"use strict"

const db = require("../db");
const { BadRequestError} = require("../expressError");


class Cart {

  /**Create cart from data, update db, return new cart
   * 
   * data should be {username, total}
   * 
   * 
  */

  static async create(username) {
      const result = await db.query(
         `INSERT INTO carts 
         (c_username)
         VALUES ($1)
         RETURNING id, c_username`,
         [username]
      )
  }
  
  /** get users cart */

  static async get(username) {
    
      const cartRes =await db.query(
          `SELECT cart_id, c_username, booking_id, trip_id, destination, partnername, all_inclusive, price_per_person, num_of_people
           FROM carts
           JOIN carts_bookings
             ON carts.id = carts_bookings.cart_id
           JOIN bookings
             ON bookings.id = carts_bookings.booking_id
           JOIN trips
             ON trips.id = bookings.trip_id
           WHERE c_username =$1`,
           [username]
      );

    const cart = cartRes.rows;
    return cart;

  }
  
  static async clear(ids){
    console.log(ids)
    let query = `delete from bookings where id in (`
    console.log(Array.isArray(ids))
    let expressionsS = ids.map(i=>"$"+(ids.indexOf(i)+1).toString());
    query+= expressionsS.join(",")+")"
    console.log(query)
    const cartRes =  await db.query(query,ids);
    return cartRes.rows;
  }
}

module.exports = Cart;