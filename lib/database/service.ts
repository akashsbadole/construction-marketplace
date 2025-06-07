import { v4 as uuidv4 } from "uuid";

// Database access - server or client
let database: any = null;
if (typeof window === "undefined") {
  // Server-side: use real database
  try {
    database = require("./client").database;
  } catch (error) {
    console.warn("Server database not available, using mock");
    database = require("./mock-client").database;
  }
} else {
  // Client-side: use mock database
  database = require("./mock-client").database;
}

export class DatabaseService {
  private db: any = null;
  private provider: string = "sqlite";

  constructor() {
    // Only initialize on server-side
    if (typeof window === "undefined" && database) {
      this.db = database.db;
      this.provider = database.provider;
    }
  }

  private get isServer() {
    return typeof window === "undefined";
  }

  // Generate UUID
  generateId(): string {
    return uuidv4();
  }

  // Users
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
    avatarUrl?: string;
    isVerified?: boolean;
  }) {
    if (!this.isServer) {
      // Client-side: make API call
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    }

    // Server-side: direct database access
    const id = this.generateId();
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, first_name, last_name, phone, role, avatar_url, is_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.phone || null,
      userData.role || "customer",
      userData.avatarUrl || null,
      userData.isVerified ? 1 : 0,
      new Date().toISOString(),
      new Date().toISOString()
    );

    if (result.changes > 0) {
      return this.getUserById(id);
    }

    throw new Error("Failed to create user");
  }

  async getUserById(id: string) {
    if (!this.isServer) {
      // Client-side: make API call
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) return null;
      return response.json();
    }

    // Server-side: direct database access
    const stmt = this.db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id) || null;
  }

  async getUserByEmail(email: string) {
    const stmt = this.db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email) || null;
  }

  // Products
  async createProduct(productData: {
    vendorId: string;
    name: string;
    description?: string;
    category: string;
    subcategory?: string;
    price: number;
    unit: string;
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    images?: string;
    specifications?: string;
    isActive?: boolean;
    stockQuantity?: number;
    rating?: number;
    totalReviews?: number;
  }) {
    const id = this.generateId();
    const stmt = this.db.prepare(`
      INSERT INTO products (
        id, vendor_id, name, description, category, subcategory, price, unit,
        min_order_quantity, max_order_quantity, images, specifications,
        is_active, stock_quantity, rating, total_reviews, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      productData.vendorId,
      productData.name,
      productData.description || null,
      productData.category,
      productData.subcategory || null,
      productData.price,
      productData.unit,
      productData.minOrderQuantity || 1,
      productData.maxOrderQuantity || null,
      productData.images || null,
      productData.specifications || null,
      productData.isActive ? 1 : 0,
      productData.stockQuantity || 0,
      productData.rating || 0,
      productData.totalReviews || 0,
      new Date().toISOString(),
      new Date().toISOString()
    );

    if (result.changes > 0) {
      return this.getProductById(id);
    }

    throw new Error("Failed to create product");
  }

  async getProductById(id: string) {
    const stmt = this.db.prepare("SELECT * FROM products WHERE id = ?");
    return stmt.get(id) || null;
  }

  async getProducts(
    filters: {
      category?: string;
      vendorId?: string;
      search?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    let sql = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (filters.category) {
      sql += " AND category = ?";
      params.push(filters.category);
    }

    if (filters.vendorId) {
      sql += " AND vendor_id = ?";
      params.push(filters.vendorId);
    }

    if (filters.search) {
      sql += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += " ORDER BY created_at DESC";

    if (filters.limit) {
      sql += " LIMIT ?";
      params.push(filters.limit);
    }

    if (filters.offset) {
      sql += " OFFSET ?";
      params.push(filters.offset);
    }

    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  // Orders
  async createOrder(orderData: {
    customerId: string;
    orderNumber: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    paymentId?: string;
    subtotal: number;
    gstAmount: number;
    deliveryCharges?: number;
    platformFee?: number;
    totalAmount: number;
    deliveryAddress: string;
    billingAddress?: string;
    estimatedDeliveryDate?: string;
    actualDeliveryDate?: string;
    notes?: string;
  }) {
    const id = this.generateId();
    const stmt = this.db.prepare(`
      INSERT INTO orders (
        id, customer_id, order_number, status, payment_status, payment_method,
        payment_id, subtotal, gst_amount, delivery_charges, platform_fee,
        total_amount, delivery_address, billing_address, estimated_delivery_date,
        actual_delivery_date, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      orderData.customerId,
      orderData.orderNumber,
      orderData.status || "pending",
      orderData.paymentStatus || "pending",
      orderData.paymentMethod || null,
      orderData.paymentId || null,
      orderData.subtotal,
      orderData.gstAmount,
      orderData.deliveryCharges || 0,
      orderData.platformFee || 0,
      orderData.totalAmount,
      orderData.deliveryAddress,
      orderData.billingAddress || null,
      orderData.estimatedDeliveryDate || null,
      orderData.actualDeliveryDate || null,
      orderData.notes || null,
      new Date().toISOString(),
      new Date().toISOString()
    );

    if (result.changes > 0) {
      return this.getOrderById(id);
    }

    throw new Error("Failed to create order");
  }

  async getOrderById(id: string) {
    const stmt = this.db.prepare("SELECT * FROM orders WHERE id = ?");
    return stmt.get(id) || null;
  }

  async getOrdersByCustomerId(customerId: string) {
    const stmt = this.db.prepare(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC"
    );
    return stmt.all(customerId);
  }

  // Simple query method for basic operations
  async query(sql: string, params: any[] = []) {
    try {
      const stmt = this.db.prepare(sql);
      if (sql.trim().toLowerCase().startsWith("select")) {
        return stmt.all(...params);
      } else {
        return stmt.run(...params);
      }
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  // Transaction support
  async transaction<T>(callback: (db: any) => T): Promise<T> {
    if (!this.isServer) {
      throw new Error("Transactions are only available on the server-side");
    }
    const transaction = this.db.transaction(callback);
    return transaction();
  }
}

// Export singleton instance
export const dbService = new DatabaseService();
