-- ─────────────────────────────────────────────
--  CARS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id           INT            NOT NULL AUTO_INCREMENT,
  name         VARCHAR(150)   NOT NULL,
  brand        VARCHAR(100)   NOT NULL,
  category     VARCHAR(80)    NOT NULL,
  price        DECIMAL(10,2)  NOT NULL,
  transmission VARCHAR(50)    NOT NULL,
  fuel         VARCHAR(50)    NOT NULL,
  seats        TINYINT        NOT NULL DEFAULT 5,
  badge        VARCHAR(60)    NULL,
  image_url    VARCHAR(500)   NULL,
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
--  BOOKINGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id           INT            NOT NULL AUTO_INCREMENT,
  car_id       INT            NOT NULL,
  first_name   VARCHAR(100)   NOT NULL,
  last_name    VARCHAR(100)   NOT NULL,
  email        VARCHAR(150)   NOT NULL,
  phone        VARCHAR(30)    NOT NULL,
  license      VARCHAR(80)    NOT NULL,
  address      VARCHAR(300)   NOT NULL,
  start_date   DATE           NOT NULL,
  end_date     DATE           NOT NULL,
  days         INT            NOT NULL,
  total        DECIMAL(10,2)  NOT NULL,
  status       ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
--  ADMIN
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         INT          NOT NULL AUTO_INCREMENT,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  name       VARCHAR(100) NOT NULL DEFAULT 'Admin',
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Mot de passe : admin123
INSERT INTO admins (email, password, name) VALUES
('admin@veloxdrive.fr',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5y8Hkzxi.C',
 'Admin VELOX')
ON DUPLICATE KEY UPDATE email=email;

-- ─────────────────────────────────────────────
--  VOITURES
-- ─────────────────────────────────────────────
INSERT INTO cars (name, brand, category, price, transmission, fuel, seats, badge, image_url) VALUES
('Ferrari Roma',              'Ferrari',     'Sport',      580000, 'Automatique', 'Essence',    2, 'Exclusif',  'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80'),
('Lamborghini Huracán',       'Lamborghini', 'Sport',      790000, 'Automatique', 'Essence',    2, 'Top',       'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'),
('Porsche 911 GT3',           'Porsche',     'Sport',      425000, 'Manuelle',    'Essence',    2, 'Populaire', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'),
('Rolls-Royce Ghost',         'Rolls-Royce', 'Luxe',       640000, 'Automatique', 'Essence',    5, 'Prestige',  'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80'),
('Bentley Continental GT',    'Bentley',     'Luxe',       555000, 'Automatique', 'Essence',    4,  NULL,       'https://images.unsplash.com/photo-1563137397-04f0311f8e4a?w=800&q=80'),
('McLaren 720S',              'McLaren',     'Sport',      685000, 'Automatique', 'Essence',    2, 'Nouveau',   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'),
('Mercedes-AMG GT',           'Mercedes',    'Sport',      360000, 'Automatique', 'Essence',    2,  NULL,       'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'),
('Tesla Model S Plaid',       'Tesla',       'Électrique', 210000, 'Automatique', 'Électrique', 5, 'Éco',       'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80'),
('BMW M8 Competition',        'BMW',         'Sport',      315000, 'Automatique', 'Essence',    4,  NULL,       'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'),
('Aston Martin DB11',         'Aston Martin','Luxe',       515000, 'Automatique', 'Essence',    4,  NULL,       'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'),
('Range Rover Autobiography', 'Land Rover',  'SUV',        275000, 'Automatique', 'Hybride',    5, 'Confort',   'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&q=80'),
('Porsche Cayenne Turbo',     'Porsche',     'SUV',        255000, 'Automatique', 'Essence',    5,  NULL,       'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80');
