// Server-side only imports
let Database: any = null;
let fs: any = null;
let path: any = null;

// Only import on server-side
if (typeof window === "undefined") {
  Database = require("better-sqlite3");
  fs = require("fs");
  path = require("path");
}

import { getDatabaseConfig, type DatabaseProvider } from "./config";

let db: any = null;
let dbProvider: DatabaseProvider | null = null;

export function getDatabase() {
  // Only allow database access on server-side
  if (typeof window !== "undefined") {
    throw new Error("Database access is only available on the server-side");
  }

  if (db && dbProvider) {
    return { db, provider: dbProvider };
  }

  const config = getDatabaseConfig();
  dbProvider = config.provider;

  switch (config.provider) {
    case "sqlite":
      return initSQLite(config.sqlite!);
    case "postgresql":
      throw new Error(
        "PostgreSQL support will be added in a future update. Please use SQLite for now."
      );
    case "dynamodb":
      throw new Error(
        "DynamoDB support will be added in a future update. Please use SQLite for now."
      );
    default:
      throw new Error(`Unsupported database provider: ${config.provider}`);
  }
}

function initSQLite(
  config: NonNullable<ReturnType<typeof getDatabaseConfig>["sqlite"]>
) {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(config.filename);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const sqlite = new Database(config.filename);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");

    db = sqlite;

    // Create tables manually
    createSQLiteTables(sqlite);

    console.log("SQLite database initialized successfully");
    return { db, provider: "sqlite" as DatabaseProvider };
  } catch (error) {
    console.error("Failed to initialize SQLite:", error);
    throw error;
  }
}

function createSQLiteTables(sqlite: any) {
  // Create tables manually for SQLite
  const createTables = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'customer',
      avatar_url TEXT,
      is_verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      business_name TEXT NOT NULL,
      description TEXT,
      address TEXT,
      gst_number TEXT,
      pan_number TEXT,
      is_verified INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      vendor_id TEXT REFERENCES vendors(id),
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      subcategory TEXT,
      price REAL NOT NULL,
      unit TEXT NOT NULL,
      min_order_quantity INTEGER DEFAULT 1,
      max_order_quantity INTEGER,
      images TEXT,
      specifications TEXT,
      is_active INTEGER DEFAULT 1,
      stock_quantity INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_id TEXT REFERENCES users(id),
      order_number TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_method TEXT,
      payment_id TEXT,
      subtotal REAL NOT NULL,
      gst_amount REAL NOT NULL,
      delivery_charges REAL DEFAULT 0,
      platform_fee REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      delivery_address TEXT NOT NULL,
      billing_address TEXT,
      estimated_delivery_date TEXT,
      actual_delivery_date TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT REFERENCES orders(id),
      product_id TEXT REFERENCES products(id),
      vendor_id TEXT REFERENCES vendors(id),
      product_name TEXT NOT NULL,
      vendor_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      variant TEXT,
      tracking_number TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      participants TEXT NOT NULL,
      type TEXT DEFAULT 'direct',
      title TEXT,
      last_message_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT REFERENCES conversations(id),
      sender_id TEXT REFERENCES users(id),
      message_type TEXT DEFAULT 'text',
      content TEXT,
      attachments TEXT,
      metadata TEXT,
      is_read INTEGER DEFAULT 0,
      read_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS kyc_documents (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      document_type TEXT NOT NULL,
      document_number TEXT,
      document_url TEXT NOT NULL,
      verification_status TEXT DEFAULT 'pending',
      verified_at TEXT,
      verified_by TEXT REFERENCES users(id),
      rejection_reason TEXT,
      expiry_date TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      user_id TEXT REFERENCES users(id),
      session_id TEXT,
      entity_type TEXT,
      entity_id TEXT,
      properties TEXT,
      user_agent TEXT,
      ip_address TEXT,
      referrer TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data TEXT,
      is_read INTEGER DEFAULT 0,
      read_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
  `;

  sqlite.exec(createTables);
  console.log("SQLite tables created successfully");
}

// Export the database instance (only on server-side)
export const database =
  typeof window === "undefined"
    ? getDatabase()
    : { db: null, provider: "mock" };
