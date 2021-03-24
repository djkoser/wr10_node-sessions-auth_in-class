INSERT INTO users
(name,email,hash,admin)
VALUES
($1, $2, $3, $4)
RETURNING id, name, email, admin; 