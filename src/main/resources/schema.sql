DROP TABLE IF EXISTS todo;

CREATE TABLE todo (
id SERIAL PRIMARY KEY,
todo VARCHAR(250),
tarkempitodo VARCHAR(255),
valmis BOOLEAN,
aikataulu timestamp
);