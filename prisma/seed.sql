-- Script SQL para base de datos Neon PostgreSQL basado en el esquema Prisma

-- Crear enumeraciones
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'STYLIST');
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- Crear tablas
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMP,
  "image" TEXT,
  "password" TEXT,
  "phoneNumber" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "Account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
  UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  UNIQUE ("identifier", "token")
);

CREATE TABLE "Service" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "duration" INTEGER NOT NULL DEFAULT 60,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "Appointment" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE
);

-- Insertar datos iniciales

-- Insertar servicios de ejemplo
INSERT INTO "Service" ("id", "name", "description", "price", "duration", "updatedAt") VALUES
('srv_001', 'Corte de cabello', 'Corte de cabello profesional para cualquier estilo', 25.00, 30, CURRENT_TIMESTAMP),
('srv_002', 'Tinte de cabello', 'Coloración completa con productos de alta calidad', 45.00, 60, CURRENT_TIMESTAMP),
('srv_003', 'Peinado', 'Peinado para ocasiones especiales', 35.00, 45, CURRENT_TIMESTAMP),
('srv_004', 'Tratamiento capilar', 'Tratamiento hidratante para cabello dañado', 40.00, 50, CURRENT_TIMESTAMP),
('srv_005', 'Corte y barba', 'Corte de cabello y arreglo de barba', 35.00, 45, CURRENT_TIMESTAMP);

-- Insertar usuario administrador (contraseña: Admin123)
-- Nota: En un entorno real, deberías generar el hash de la contraseña con bcrypt
-- Este es solo un ejemplo y la contraseña está en texto plano para fines de demostración
INSERT INTO "User" ("id", "name", "email", "password", "role", "updatedAt") VALUES
('usr_admin', 'Administrador', 'admin@example.com', '$2a$10$rMOxcHZg8TXEdI8a5QYfZeV5YyQnYq5iSJR.3qVxdPr9UYl1vGTMi', 'ADMIN', CURRENT_TIMESTAMP);

-- Insertar estilista de ejemplo
INSERT INTO "User" ("id", "name", "email", "password", "phoneNumber", "role", "updatedAt") VALUES
('usr_stylist', 'María Estilista', 'estilista@example.com', '$2a$10$rMOxcHZg8TXEdI8a5QYfZeV5YyQnYq5iSJR.3qVxdPr9UYl1vGTMi', '+34600000000', 'STYLIST', CURRENT_TIMESTAMP);

-- Nota: Este script es para fines de demostración y puede requerir ajustes según la configuración específica de tu base de datos Neon.
-- Para ejecutarlo en Neon, puedes usar el editor SQL en el panel de control de Neon o conectarte mediante una herramienta como psql o un cliente PostgreSQL.