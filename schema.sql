-- DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT;
    product_name VARCHAR(50) NULL; 
    department_name VARCHAR(50) NULL;
    price DECIMAL (10,4) NULL;
    stock_quantity INT (100) NULL;
)

SELECT * FROM products;

