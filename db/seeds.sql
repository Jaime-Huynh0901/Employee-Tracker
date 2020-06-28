INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Mary", "Poppins", 1, null), ("Harry", "Potter", 3, null), ("Booker", "Dewitt", 2, 1), ("Thor","Buato", 4, 2), ("Iron", "Man", 4, 2), ("Black", "Widow", 5, null), ("Sander", "Clegane", 6, null), ("Tharnos", "Le", 7, null);

INSERT INTO department (dep_name) 
VALUES ("Sale"), ("IT/ Web Development"), ("Business Operations"), ("Compliance/Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 75000, 1), ("salesperson", 65000, 1), ("Lead Engineer", 1200000, 2), ("Software Engineer", 100000, 2), ("Account Manager", 50000, 3), ("Accountant", 35000, 3), ("Legal Team Lead", 150000, 4);