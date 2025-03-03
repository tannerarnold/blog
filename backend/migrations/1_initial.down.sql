-- SESSIONS
ALTER TABLE sessions DROP INDEX user_id_expires_at_idx;
DROP TABLE sessions;

-- USERS
ALTER TABLE users DROP INDEX username_email_idx;
DROP TABLE users;

-- IMAGES
DROP TABLE images;

-- BLOG POSTS
ALTER TABLE posts DROP INDEX slug_idx;
ALTER TABLE posts DROP INDEX date_posted_idx;
DROP TABLE posts;