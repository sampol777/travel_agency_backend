"use strict"

const db = require("../db");
const {BadRequestError, NotFoundError} = require("../expressError");
const {sqlForPartialUpdate} = require("../helpers/sql");

/** Related functions for trips. */

class Trip {
    /** Create a trip (from data), update db, return new company data.
     * 
     * data should be {destination, numOfNights, allInclusive, pricePP}
     * 
     * Returns {destination, numOfNights, allInclusive, pricePP}
     * 
     * 
      */

    static async create({destination,partnername, allInclusive, pricePP, imageUrl, check_in, check_out}) {
        const duplicateCheck = await db.query(
            `SELECT *
            FROM trips
            WHERE (destination = $1 AND partnername = $2 AND all_inclusive = $3 AND price_per_person = $4 AND check_in = $5 AND check_out = $6) `,
            [destination,partnername, allInclusive, pricePP, check_in, check_out]
        );

        if (duplicateCheck.rows[0])
          throw new BadRequestError(`Duplicate trip: ${destination}`);
        console.log('hiiiiiiiiiiiiiiiii')
        console.log(destination, partnername, allInclusive, pricePP, imageUrl, check_in, check_out);
        const result = await db.query(
            `INSERT INTO trips
            (destination, partnername, check_in, check_out, all_inclusive, price_per_person, image_url )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING destination, partnername, all_inclusive AS "allInclusive", price_per_person AS "pricePP", check_in, check_out`,
            [
                destination,partnername,check_in, check_out, allInclusive, pricePP, imageUrl, false 
            ]
        
        );
        
        console.log(result)
        const trip = result.rows[0];

        return trip;
    }

    /** Find all trips (optional filter on searchFilters)
     * 
     * searchFilters (all optional):
     * -destination
     * -numOfNights
     * -allInclusive
     * -minPrice
     * -maxPrice
     * 
     * Returns[{destination,partnername, numOfNights, allInclusive, pricePP}, ...]
     */

    static async findAll(searchFilters = {}) {
        let query = `SELECT id,
                            destination,
                            partnername,
                            TO_CHAR(check_in, 'mm/dd/yyyy') as check_in,
                            TO_CHAR(check_out, 'mm/dd/yyyy') as check_out,
                            (check_out - check_in) AS "numOfNights",
                            all_inclusive AS "allInclusive",
                            price_per_person as "pricePP",
                            image_url
                    FROM trips`;
        let queryValues = [false];
        let whereExpressions = [`t_deleted=$${queryValues.length}`];

        const {destination,partnername, numOfNights, allInclusive, minPrice, maxPrice} = searchFilters;

        if (minPrice > maxPrice) {
            throw new BadRequestError("Min price cannot be greater than max")
        }

         // For each possible search term, add to whereExpressions and queryValues so
         // we can generate the right SQL

         if (destination !== undefined) {
             queryValues.push(`%${destination}%`);
             whereExpressions.push(`destination ILIKE $${queryValues.length}`);
         }

         if (partnername !== undefined) {
            queryValues.push(`%${partnername}%`);
            whereExpressions.push(`partnername ILIKE $${queryValues.length}`);
        }

        if (numOfNights !== undefined) {
            queryValues.push(numOfNights);
            whereExpressions.push(`numOfNights= $${queryValues.length}`);
        }

        if (allInclusive !== undefined) {
            queryValues.push(allInclusive);
            whereExpressions.push(`allInclusive = $${queryValues.length}`);
        }

         if (minPrice !== undefined) {
             queryValues.push(minPrice);
             whereExpressions.push(`pricePP >= $${queryValues.length}`)
         }

         if (maxPrice !== undefined) {
            queryValues.push(maxPrice);
            whereExpressions.push(`pricePP <= $${queryValues.length}`)
        }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
          }

        // Finalize query and return results

        query += " ORDER BY destination";
        const tripsRes = await db.query(query, queryValues);
        
        return tripsRes.rows;

         
    }
 

    /** Given trip id , return data about trip */

    static async get(id) {
        const tripRes = await db.query(
            `SELECT id,
                    destination,
                    partnername,
                    num_of_nights AS "numOfNights",
                    all_inclusive AS "allInclusive",
                    price_per_person AS "pricePP",
                    image_url
             FROM trips
             WHERE id = $1`,
             [id]

        );

        const trip = tripRes.rows[0];

        if (!trip) throw NotFoundError(`No trip found`);

        return trip;
    }


    /** Update trip with 'data' 
     * 
     * This is a "partial update" --- it's fine if data doesn't contain all the fields; this only changes provided ones.
    */

    static async update(id, data) {
        const {setCols, values} = sqlForPartialUpdate(
            data,
            {
             numOfNights: "num_of_nights",
             allInclusive: "all_inclusive",
             pricePP: "price_per_person"   
                
            }
        );

        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE trips
                          SET ${setCols}
                          WHERE id = ${idVarIdx}
                          RETURNING id,
                          destination,
                          partnername,
                          num_of_nights AS "numOfNights",
                          all_inclusive AS "allInclusive",
                          price_per_person AS "pricePP"`;
                        
        const result = await db.query(querySql, [...values,id])
        const trip = result.rows[0];

        if (!trip) throw new NotFoundError(`No trip: ${id}`);

        return trip;

    }


    /** get partner trips */

    static async getPartnerTrips(username) {
        
        const tripRes = await db.query(
            `SELECT id,
            destination,
            partnername,
            TO_CHAR(check_in, 'dd/mm/yyyy') as check_in,
            TO_CHAR(check_out, 'dd/mm/yyyy') as check_out,
            (check_out - check_in) AS "numOfNights",
            all_inclusive AS "allInclusive",
            price_per_person as "pricePP",
            image_url
            FROM trips
            WHERE partnername=$1 AND t_deleted=$2`,
    [username, false]
    );

    const trips = tripRes.rows;
    console.log(trips)
    return trips;
    }

    /** delete partner trip */

    static async deletePartnerTrip(id){
        console.log('deleting')
        console.log(id)
        const deleteTrip = await db.query(
            `UPDATE trips
             SET t_deleted=$1
             WHERE id=$2
             RETURNING destination`,
            [true, id] 
        )

        const trip = deleteTrip.rows[0];
            if (!trip) throw new NotFoundError(`No trip found`);
    }

}

module.exports = Trip;