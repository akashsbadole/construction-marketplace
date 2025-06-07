import { dbService } from "./service";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Create sample users
    const customer = await dbService.createUser({
      email: "customer@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+91-9876543210",
      role: "customer",
      isVerified: true,
    });

    const vendor = await dbService.createUser({
      email: "vendor@example.com",
      firstName: "Rajesh",
      lastName: "Kumar",
      phone: "+91-9876543211",
      role: "vendor",
      isVerified: true,
    });

    const contractor = await dbService.createUser({
      email: "contractor@example.com",
      firstName: "Amit",
      lastName: "Sharma",
      phone: "+91-9876543212",
      role: "contractor",
      isVerified: true,
    });

    console.log("Created sample users");

    // Create sample products
    const products = [
      {
        vendorId: vendor.id,
        name: "Premium Cement - OPC 53 Grade",
        description:
          "High quality Ordinary Portland Cement suitable for all construction needs",
        category: "Cement",
        subcategory: "OPC",
        price: 450,
        unit: "bag",
        minOrderQuantity: 10,
        maxOrderQuantity: 1000,
        stockQuantity: 500,
        images: JSON.stringify(["/images/cement-bag.jpg"]),
        specifications: JSON.stringify({
          grade: "53",
          weight: "50kg",
          brand: "UltraTech",
        }),
        isActive: true,
        rating: 4.5,
        totalReviews: 25,
      },
      {
        vendorId: vendor.id,
        name: "TMT Steel Bars - Fe 500D",
        description:
          "High strength TMT bars with superior bendability and weldability",
        category: "Steel",
        subcategory: "TMT Bars",
        price: 65000,
        unit: "ton",
        minOrderQuantity: 1,
        maxOrderQuantity: 50,
        stockQuantity: 100,
        images: JSON.stringify(["/images/tmt-bars.jpg"]),
        specifications: JSON.stringify({
          grade: "Fe 500D",
          diameter: "12mm",
          length: "12m",
        }),
        isActive: true,
        rating: 4.7,
        totalReviews: 18,
      },
      {
        vendorId: vendor.id,
        name: "Red Clay Bricks",
        description: "Traditional red clay bricks for construction",
        category: "Bricks",
        subcategory: "Clay Bricks",
        price: 8,
        unit: "piece",
        minOrderQuantity: 100,
        maxOrderQuantity: 10000,
        stockQuantity: 5000,
        images: JSON.stringify(["/images/red-bricks.jpg"]),
        specifications: JSON.stringify({
          size: "230x110x75mm",
          compressive_strength: "3.5 N/mm²",
        }),
        isActive: true,
        rating: 4.2,
        totalReviews: 32,
      },
      {
        vendorId: vendor.id,
        name: "River Sand",
        description: "Clean river sand for construction and plastering",
        category: "Sand",
        subcategory: "River Sand",
        price: 1200,
        unit: "cubic_ft",
        minOrderQuantity: 10,
        maxOrderQuantity: 1000,
        stockQuantity: 200,
        images: JSON.stringify(["/images/river-sand.jpg"]),
        specifications: JSON.stringify({
          fineness_modulus: "2.6",
          silt_content: "<3%",
        }),
        isActive: true,
        rating: 4.3,
        totalReviews: 15,
      },
      {
        vendorId: vendor.id,
        name: "Ceramic Floor Tiles",
        description: "Premium ceramic tiles for flooring",
        category: "Tiles",
        subcategory: "Floor Tiles",
        price: 45,
        unit: "sq_ft",
        minOrderQuantity: 50,
        maxOrderQuantity: 5000,
        stockQuantity: 1000,
        images: JSON.stringify(["/images/ceramic-tiles.jpg"]),
        specifications: JSON.stringify({
          size: "600x600mm",
          thickness: "10mm",
          finish: "Glossy",
        }),
        isActive: true,
        rating: 4.6,
        totalReviews: 28,
      },
    ];

    for (const productData of products) {
      await dbService.createProduct(productData);
    }

    console.log("Created sample products");

    // Create sample order
    const order = await dbService.createOrder({
      customerId: customer.id,
      orderNumber: "ORD-2024-001",
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "razorpay",
      paymentId: "pay_test123",
      subtotal: 4500,
      gstAmount: 810,
      deliveryCharges: 200,
      platformFee: 50,
      totalAmount: 5560,
      deliveryAddress: JSON.stringify({
        name: "John Doe",
        phone: "+91-9876543210",
        address_line_1: "123 Construction Site",
        address_line_2: "Near Metro Station",
        city: "Mumbai",
        state: "Maharashtra",
        postal_code: "400001",
      }),
      estimatedDeliveryDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: "Deliver during working hours only",
    });

    console.log("Created sample order");

    console.log("Database seeding completed successfully!");

    return {
      users: { customer, vendor, contractor },
      products: products.length,
      orders: 1,
      analytics: 2,
      notifications: 1,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log("Seeding result:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
