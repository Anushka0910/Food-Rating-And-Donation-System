-- Create the database
CREATE DATABASE IF NOT EXISTS food_rating_system;
USE food_rating_system;
drop database food_rating_system;

drop table users;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for users
INSERT INTO users (username, email) VALUES
('Anushka', 'anushka@example.com'),
('Yukta', 'yukta@example.com');

select * from users;

CREATE TABLE hotels (
    hotel_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);


ALTER TABLE hotels ADD latitude DECIMAL(10, 8), ADD longitude DECIMAL(11, 8);
UPDATE hotels SET latitude = 20.9042, longitude = 74.7749 WHERE hotel_id = 1; -- Example for Hotel Rasraaj
UPDATE hotels SET latitude = 20.9042, longitude = 74.7749 WHERE hotel_id = 2; -- Example for Hotel Jalpan

-- Sample data for hotels
INSERT INTO hotels (hotel_name, location) VALUES
('Rasraj', 'Dhule, India'),
('Jalpan', 'Dhule, India');

select * from hotels;


CREATE TABLE dishes (
    dish_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    dish_name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Sample data for dishes, associated with hotels
INSERT INTO dishes (hotel_id, dish_name, image_url) VALUES
(1, 'Pav Bhaji', 'assets/pav bhaji.jpg'),
(1, 'Masala Dosa', 'assets/dosa.jpg'),
(1, 'Chole Bhature', 'assets/chole bhature.webp'),
(2, 'Pav Bhaji', 'assets/jalpan_pavbhaji.jpg'),
(2, 'Masala Dosa', 'assets/jalpan_dosa.jpg'),
(2, 'Chole Bhature', 'assets/jalpan_cholebhature.jpg');



-- Drop the ratings table if it exists
DROP TABLE IF EXISTS ratings;

drop table ratings;

CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    dish_id INT NOT NULL,
    hotel_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dish_id) REFERENCES dishes(dish_id),  -- Assumes you have a `dishes` table
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)  -- Assumes you have a `hotels` table
);




-- Select to check the data in ratings table
SELECT * FROM ratings;
select * from dishes;
INSERT INTO ratings (dish_id, rating) VALUES (1, 4);

ALTER TABLE ratings ADD CONSTRAINT CHECK (rating BETWEEN 1 AND 5);

CREATE INDEX idx_dish_name ON dishes(name);

SELECT hotel_id, dish_id, AVG(rating) AS average_rating
FROM ratings
GROUP BY hotel_id, dish_id;


SELECT 
    dish_id,
    AVG(rating) AS average_rating
FROM 
    ratings
WHERE 
    hotel_id = 1
GROUP BY 
    dish_id;


-- Donors Table: Stores hotel information
CREATE TABLE donors (
    hotel_id VARCHAR(20) PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    hotel_email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Receivers Table: Stores organization information
CREATE TABLE receivers (
    organization_id VARCHAR(20) PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL,
    organization_email VARCHAR(100) UNIQUE NOT NULL,
    organization_phone VARCHAR(20),
    organization_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Donations Table: Stores information about food donations from hotels
CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(255) NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    food_quantity INT NOT NULL,
    isBooked BOOLEAN DEFAULT 0
);


-- Bookings Table: Stores booking information when an organization books a donation
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL,  -- Only storing organization name here
    donation_id INT NOT NULL,  -- Donation ID from donations table
    booking_status VARCHAR(20) DEFAULT 'pending',  -- Booking status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE ON UPDATE CASCADE
);


SELECT * FROM donations WHERE id = 6 AND isBooked = 0;
SELECT * FROM receivers;
SELECT * FROM donors;
SELECT * FROM donations;
SELECT * FROM bookings;

