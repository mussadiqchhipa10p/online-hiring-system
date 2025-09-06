-- Initialize the database
CREATE DATABASE online_hiring_system;

-- Create extensions if needed
\c online_hiring_system;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
