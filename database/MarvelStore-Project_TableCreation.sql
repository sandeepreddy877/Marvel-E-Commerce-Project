create database MarvelStoreDB;
use marvelstoredb;

/*
-- Category 1: Clothes
CREATE TABLE marvel_clothes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url VARCHAR(500)
);

-- Category 2: Magnets
CREATE TABLE marvel_magnets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url VARCHAR(500)
);

-- Category 3: Keychains
CREATE TABLE marvel_keychains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url VARCHAR(500)
);

-- Category 4: Action Figures
CREATE TABLE marvel_action_figures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url VARCHAR(500)
);

-- Category 5: Tools
CREATE TABLE marvel_tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url VARCHAR(500)
);
*/


CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url TEXT,
    category VARCHAR(100)
);

ALTER TABLE products ADD COLUMN size VARCHAR(100) DEFAULT NULL;

UPDATE products 
SET size = 'S, M, L, XL' 
WHERE category = 'marvel clothes';

update products set image_url = "https://i.etsystatic.com/31372700/r/il/19c77e/6813591532/il_fullxfull.6813591532_2kfn.jpg" where id = 88;


