"use strict";

require("dotenv").config()

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;
const MERCHANT_ID= 'rv4zf2h2vnd2jbzx'
const PRIVATE_KEY= 'cfa073531ee4f098b62b2c52a3265c80'
const PUBLIC_KEY= 't6zms7qzybw24wnv'

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "travel_agency_test"
        : process.env.DATABASE_URL || "travel_agency";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;


module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    MERCHANT_ID,
    PRIVATE_KEY,
    PUBLIC_KEY,
    getDatabaseUri,
};