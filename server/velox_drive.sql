-- ════════════════════════════════════════════════════════════
--   VELOX DRIVE — Base de données complète
--   Commande d'import : mysql -u root -p < velox_drive.sql
-- ════════════════════════════════════════════════════════════


USE velox_drive;

-- ─────────────────────────────────────────────────────────────
--  TABLE : users
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT           NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  role       ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
--  TABLE : cars
-- ─────────────────────────────────────────────────────────────
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
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_brand    (brand),
  INDEX idx_category (category),
  INDEX idx_price    (price)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
--  TABLE : bookings
-- ─────────────────────────────────────────────────────────────
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
  status       ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  INDEX idx_car_id    (car_id),
  INDEX idx_email     (email),
  INDEX idx_status    (status),
  INDEX idx_dates     (start_date, end_date)
) ENGINE=InnoDB;

-- ════════════════════════════════════════════════════════════
--  DONNÉES DE DÉMO
-- ════════════════════════════════════════════════════════════

-- ── Admin user (mot de passe : admin123) ──
-- Hash bcrypt de "admin123" avec salt 12
INSERT INTO users (name, email, password, role) VALUES
('Admin VELOX', 'admin@veloxdrive.fr',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5y8Hkzxi.C',
 'admin');

-- ── Voitures de démo ──
INSERT INTO cars (name, brand, category, price, transmission, fuel, seats, badge, image_url) VALUES
('Ferrari Roma',           'Ferrari',     'Sport',      890.00,  'Automatique', 'Essence',    2, 'Exclusif',  'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80'),
('Lamborghini Huracán',    'Lamborghini', 'Sport',     1200.00,  'Automatique', 'Essence',    2, 'Top',       'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'),
('Porsche 911 GT3',        'Porsche',     'Sport',      650.00,  'Manuelle',    'Essence',    2, 'Populaire', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'),
('Rolls-Royce Ghost',      'Rolls-Royce', 'Luxe',       980.00,  'Automatique', 'Essence',    5, 'Prestige',  'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80'),
('Bentley Continental GT', 'Bentley',     'Luxe',       850.00,  'Automatique', 'Essence',    4, NULL,        'https://images.unsplash.com/photo-1563137397-04f0311f8e4a?w=800&q=80'),
('McLaren 720S',           'McLaren',     'Sport',     1050.00,  'Automatique', 'Essence',    2, 'Nouveau',   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'),
('Mercedes-AMG GT',        'Mercedes',    'Sport',      550.00,  'Automatique', 'Essence',    2, NULL,        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'),
('Tesla Model S Plaid',    'Tesla',       'Électrique', 320.00,  'Automatique', 'Électrique', 5, 'Éco',       'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80'),
('BMW M8 Competition',     'BMW',         'Sport',      480.00,  'Automatique', 'Essence',    4, NULL,        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'),
('Aston Martin DB11',      'Aston Martin','Luxe',       790.00,  'Automatique', 'Essence',    4, NULL,        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'),
('Range Rover Autobiography','Land Rover','SUV',        420.00,  'Automatique', 'Hybride',    5, 'Confort',   'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&q=80'),
('Porsche Cayenne Turbo',  'Porsche',     'SUV',        390.00,  'Automatique', 'Essence',    5, NULL,        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80');

-- ── Réservations de démo ──
INSERT INTO bookings (car_id, first_name, last_name, email, phone, license, address, start_date, end_date, days, total, status) VALUES
(1, 'Sophie',    'Martin',   'sophie.martin@email.fr',   '+33 6 11 22 33 44', 'AA-123456-78', '12 Rue de la Paix, Paris 75001',        '2025-06-10', '2025-06-13', 3, 2670.00, 'confirmed'),
(2, 'Alexandre', 'Dupont',   'alex.dupont@email.fr',     '+33 6 55 66 77 88', 'BB-654321-99', '8 Avenue Foch, Paris 75016',            '2025-06-15', '2025-06-17', 2, 2400.00, 'pending'),
(4, 'Isabelle',  'Leclerc',  'isa.leclerc@email.fr',     '+33 6 99 88 77 66', 'CC-111222-33', '3 Allée des Roses, Lyon 69006',         '2025-06-20', '2025-06-21', 1,  980.00, 'confirmed'),
(8, 'Thomas',    'Bernard',  'thomas.b@email.fr',        '+33 6 44 33 22 11', 'DD-789012-45', '27 Boulevard Voltaire, Paris 75011',    '2025-06-25', '2025-06-28', 3,  960.00, 'cancelled'),
(3, 'Marie',     'Fontaine', 'marie.fontaine@email.fr',  '+33 6 77 88 99 00', 'EE-345678-90', '5 Rue du Faubourg Saint-Honoré, Paris', '2025-07-01', '2025-07-04', 3, 1950.00, 'pending');