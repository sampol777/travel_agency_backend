"use strict";

const db = require("../db");
const {BadRequestError, NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Order {

static async create({data}) {
    
    const result = await db.query(
        `INSERT INTO orders (o_username, 
                               transaction_id,
                               order_info)
         VALUES ($1, $2, $3)
         RETURNING *`,
         [data.username, data.transaction_id, data.orderInfo]
        
    )
    
    let order = result.rows[0];
    
    if(order.id){
    let query = `INSERT INTO orders_bookings (order_id,booking_id) 
                  VALUES`
    
    let expressions = (data.bookingsIds.map(i=>"($1,$"+(data.bookingsIds.indexOf(i)+2).toString()+")"));
    data.bookingsIds.unshift(order.id);
    query+= expressions.join(",")
    const cartRes =  await db.query(query,data.bookingsIds);
    data.bookingsIds.shift();
    }

    if(order.id){
        let query = `DELETE FROM carts_bookings 
                     WHERE booking_id IN `;
        
        let expressionS = (data.bookingsIds.map(i=>"$"+(data.bookingsIds.indexOf(i)+1).toString()));
        query+="(" + expressionS.join(",") + ")" 
        const cleanCart =  await db.query(query,data.bookingsIds);
        console.log(data)
    }

    
    return (order);
}

static async getOrdersUser(username){

    const res=await db.query(
        `SELECT * 
         FROM orders 
         JOIN orders_bookings ON orders.id = orders_bookings.order_id
         JOIN bookings ON bookings.id = orders_bookings.booking_id 
         JOIN trips ON trips.id = bookings.trip_id
         WHERE  o_username=$1`,
         [username]
    );

    const orders = res.rows;
    return orders;
}

static async getOrdersPartner(username){
    const res=await db.query(
        `SELECT * 
         FROM orders 
         JOIN orders_bookings ON orders.id = orders_bookings.order_id
         JOIN bookings ON bookings.id = orders_bookings.booking_id 
         JOIN trips ON trips.id = bookings.trip_id
         WHERE  partnername=$1
         ORDER BY order_id
         `,
         [username]
    );

    const orders = res.rows;
    return orders; 
}

}

module.exports = Order;

