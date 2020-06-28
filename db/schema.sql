-- Create the database task_saver_db and specified it for use.
CREATE DATABASE comp_employees_db;

USE comp_employees_db;

-- Create the department table
CREATE TABLE department  (
  id INT NOT NULL AUTO_INCREMENT,
  dep_name VARCHAR (30) NOT NULL,
  PRIMARY KEY (id)
);

-- Create the role table
CREATE TABLE roles  (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (10,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

-- Create the employee table
CREATE TABLE employee  (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);