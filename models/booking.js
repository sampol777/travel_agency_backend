"use strict";

const db = require("../db");
const {BadRequestError, NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Booking {
    /** create booking */

    static async create({trip_id, cart_id, num_of_people }) {
        const result = await db.query(
            `INSERT INTO bookings (trip_id, 
                                   num_of_people)
             VALUES ($1, $2)
             RETURNING id, trip_id, num_of_people`,
             [trip_id, num_of_people]
            
        );
        
        let booking = result.rows[0];

        const res = await db.query(
            `INSERT INTO carts_bookings (cart_id, booking_id)
             VALUES ($1, $2)
             RETURNING id, cart_id, booking_id`,
             [cart_id, booking.id]
        );

        return booking;
    }

    /** update booking */

    static async update(id, num_of_people) {
        const result = await db.query(
            `UPDATE bookings SET num_of_people= $1
             WHERE id=$2`,
             [num_of_people, id]
        );
        const booking = result.rows[0];

        if (!booking) throw new NotFoundError(`No booking: ${id}`);

        return booking;
    }

    static async remove(id) {
        const result = await db.query(
            `DELETE 
             FROM bookings
             WHERE id = $1`,
             [id]
        );
    }
}

module.exports = Booking;