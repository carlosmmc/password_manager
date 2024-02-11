-- Create tables

CREATE TABLE Keys (
    id UUID PRIMARY KEY,
    public_key VARCHAR(1024),
    private_key VARCHAR(1024),
    account_key VARCHAR(1024)
);

CREATE TABLE Users (
    id UUID PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    kid UUID REFERENCES Keys ON DELETE SET NULL
);

CREATE TABLE Items (
    id UUID PRIMARY KEY,
    usid UUID REFERENCES Users ON DELETE CASCADE,
    kid UUID REFERENCES Keys ON DELETE SET NULL,
    overview VARCHAR(1024),
    details VARCHAR(1024)
);
