-- Update admin user dengan bcrypt hash password 'admin123'
-- Hash: $2b$10$aMO.FeGWpLRvJXxJpLbxE.GhL6GvSCWDXh3LGmMuVQPlmCKvPqaHu

UPDATE ecommerce.users 
SET password = 'admin123'
WHERE username = 'admin';

-- Verify update
SELECT id, username, role, password FROM ecommerce.users WHERE username = 'admin';
