-- Create Database
CREATE DATABASE IF NOT EXISTS leave_management;
USE leave_management;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    role ENUM('employee','manager') NOT NULL
);

-- Leave balance table
CREATE TABLE leave_balance (
    user_id INT PRIMARY KEY,
    vacation INT DEFAULT 10,
    sick INT DEFAULT 5,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Leave requests table
CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    leave_type VARCHAR(20),
    start_date DATE,
    end_date DATE,
    reason VARCHAR(255),
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    manager_comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data
INSERT INTO users (name, email, password, role) VALUES
('Ravi', 'emp@test.com', '1234', 'employee'),
('Manager', 'manager@test.com', '1234', 'manager');

INSERT INTO leave_balance (user_id, vacation, sick)
VALUES (1, 10, 5);

