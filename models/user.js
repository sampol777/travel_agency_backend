"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {sqlForPartialUpdate} = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    
    //authenticate user with username, password.

    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email
            FROM users
            WHERE username = $1 AND deleted=$2`,
            [username,false],
        );

        const user = result.rows[0];

        if (user && !user.deleted) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }
    
    //register user with data

    static async register(
        {username, role, password,firstName, lastName, email}) {
            const duplicateCheck = await db.query(
                `SELECT username
                 FROM users
                 WHERE username = $1`,
                [username],
            );

            if (duplicateCheck.rows[0]) {
                throw new BadRequestError(`Duplicate username: ${username}`);
            }

            const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

            
            const result = await db.query(
                `INSERT INTO users
                 (  username,
                    role,
                    password,
                    first_name,
                    last_name,
                    email,
                    deleted)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
                [
                    username,
                    role,
                    hashedPassword,
                    firstName,
                    lastName,
                    email,
                    false    
                ],
            );

            //const resCart

            const user = result.rows[0];

            return user;
        }


        //given a username, return data about user.

        static async get(username) {
            

            const userRes = await db.query(
                `SELECT username,
                        role,
                        first_name AS "firstName",
                        last_name AS "lastName",
                        email
                 FROM users
                 WHERE username = $1`,
                 [username]
            );

            const user = userRes.rows[0];

            if (!user) throw new NotFoundError(`No user: ${username}`);
            console.log(user.role)
            if(user.role==="user"){
                const cartRes=await db.query(
                    `SELECT id
                     FROM carts
                     WHERE c_username = $1`,
                     [username]
                )

                user.cart_id = cartRes.rows[0].id
            }
        
         return user;
        }

        //update user with data

        static async update(username, data) {
            if (data.password) {
              data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
            }
        
            const { setCols, values } = sqlForPartialUpdate(
                data,
                {
                  firstName: "first_name",
                  lastName: "last_name",
                });
            const usernameVarIdx = "$" + (values.length + 1);
        
            const querySql = `UPDATE users 
                              SET ${setCols} 
                              WHERE username = ${usernameVarIdx} 
                              RETURNING username,
                                        first_name AS "firstName",
                                        last_name AS "lastName",
                                        email,
                                        is_admin AS "isAdmin"`;
            const result = await db.query(querySql, [...values, username]);
            const user = result.rows[0];
        
            if (!user) throw new NotFoundError(`No user: ${username}`);
        
            delete user.password;
            return user;
          }

          // delete given user from database; return undefined

          static async remove(username) {
            let result = await db.query(
                  `UPDATE users
                   SET deleted = $2
                   WHERE username = $1
                   RETURNING username`,
                [username,true],
            );
            const user = result.rows[0];
            if (!user) throw new NotFoundError(`No user: ${username}`);
          }

}

module.exports = User;