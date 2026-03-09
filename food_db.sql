CREATE DATABASE food_db;

USE food_db;

CREATE TABLE donors (
    hotel_id VARCHAR(20) PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    hotel_email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receivers (
    organization_id VARCHAR(20) PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL,
    organization_email VARCHAR(100) UNIQUE NOT NULL,
    organization_phone VARCHAR(20),
    organization_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)  -- Assuming there's an organizations table

    
);

CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_name VARCHAR(255),
  food_name VARCHAR(255),
  food_quantity INT,
  isBooked BOOLEAN DEFAULT 0
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_name VARCHAR(100) NOT NULL,  -- Only storing organization name
  donation_id INT NOT NULL, -- Donation ID
  booking_status VARCHAR(20) DEFAULT 'pending', -- Booking status
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id)
);

SELECT * FROM donations WHERE id = 6 AND isBooked = 0;

select *from receivers;
select *from donors;
select *from donations;
select *from bookings;