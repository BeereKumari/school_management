





CREATE TABLE IF NOT EXISTS schools (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)   NOT NULL,
  address     VARCHAR(500)   NOT NULL,
  latitude    DECIMAL(10, 6) NOT NULL,
  longitude   DECIMAL(10, 6) NOT NULL,
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX       idx_coordinates (latitude, longitude),
  INDEX       idx_created_at  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data: 10 real Indian schools with accurate coordinates
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Delhi Public School, R.K. Puram',   'Sector 8, R.K. Puram, New Delhi, Delhi 110022',         28.5672,  77.1853),
  ('Kendriya Vidyalaya, Connaught Place','Connaught Place, New Delhi, Delhi 110001',               28.6330,  77.2194),
  ('The Shri Ram School Vasant Vihar',   'Vasant Vihar, New Delhi, Delhi 110057',                  28.5445,  77.1577),
  ('St. Columba''s School',              'Ashok Place, New Delhi, Delhi 110001',                   28.6378,  77.2075),
  ('Ryan International School Rohini',   'Sector 25, Rohini, New Delhi, Delhi 110085',             28.7200,  77.1135),
  ('Cathedral & John Connon School',     'Fort, Mumbai, Maharashtra 400001',                       18.9334,  72.8340),
  ('The Bishop''s School',               'Camp, Pune, Maharashtra 411001',                         18.5205,  73.8567),
  ('Bishop Cotton Boys'' School',        'St. Mark''s Road, Bengaluru, Karnataka 560001',          12.9716,  77.5937),
  ('The Lawrence School Lovedale',       'Lovedale, The Nilgiris, Tamil Nadu 643003',              11.3870,  76.7880),
  ('Don Bosco School Park Circus',       'Park Circus, Kolkata, West Bengal 700017',               22.5448,  88.3734);
