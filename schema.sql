-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    username VARCHAR(16) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);