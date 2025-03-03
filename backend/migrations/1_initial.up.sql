-- BLOG POSTS
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_posted DATETIME NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL
);
CREATE INDEX date_posted_idx ON posts (date_posted);
CREATE INDEX slug_idx ON posts (slug);
CREATE UNIQUE INDEX slug_unique_idx ON posts (slug);

-- IMAGES
CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    image_data BLOB NOT NULL
);
CREATE INDEX file_name_idx ON images (file_name);
CREATE UNIQUE INDEX file_name_unique_idx ON images (file_name);

-- USERS
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    display TEXT,
    password_hash TEXT NOT NULL
);
CREATE UNIQUE INDEX email_unique_idx ON users (email);
CREATE INDEX username_email_idx ON users (username, email);

-- SEED INITIAL ADMIN USER
INSERT INTO users (username, email, display, password_hash)
VALUES ('admin', 'admin@arnoldtech.dev', 'Tanner Arnold', 'argon2id$19$65536$3$2$k1mmhh7Gc/HI0lsG3V74XQ$E3I17gwgiTURYf3Us21Jmfq9nq7sd3LenGQn51bp+Yo');

-- SESSIONS
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_hash TEXT NOT NULL,
    csrf_token TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL
);
CREATE INDEX user_id_expires_at_idx ON sessions (user_id, expires_at);
CREATE INDEX session_hash_idx ON sessions (session_hash);