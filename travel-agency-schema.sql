

CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    role VARCHAR(10),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
      CHECK (position('@' IN email) > 1),
    deleted BOOLEAN NOT NULL
    
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  c_username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    destination TEXT NOT NULL,
    partnername VARCHAR(25)
      REFERENCES users ON DELETE CASCADE,
    check_in  DATE NOT NULL,
    check_out DATE NOT NULL,
    all_inclusive BOOLEAN NOT NULL DEFAULT FALSE,  
    price_per_person INTEGER,
    image_url TEXT,
    t_deleted BOOLEAN NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER
    REFERENCES trips ,
  num_of_people INTEGER  
);



CREATE TABLE carts_bookings (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER
    REFERENCES carts ON DELETE CASCADE,
  booking_id INTEGER
    REFERENCES bookings ON DELETE CASCADE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    o_username VARCHAR
      REFERENCES users ON DELETE CASCADE,
    transaction_id TEXT,
    order_info TEXT NOT NULL
);

CREATE TABLE orders_bookings (
  id SERIAL PRIMARY KEY,
  order_id INTEGER
    REFERENCES orders ON DELETE CASCADE,
  booking_id INTEGER
    REFERENCES bookings ON DELETE CASCADE
  
);

