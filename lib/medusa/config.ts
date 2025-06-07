export const medusaConfig = {
  // MedusaJS Backend URL
  backendUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",

  // MedusaJS Publishable Key (for storefront API)
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",

  // Default region (India)
  defaultRegion: process.env.NEXT_PUBLIC_MEDUSA_DEFAULT_REGION || "reg_india",

  // Default currency
  defaultCurrency: "inr",

  // Default country code
  defaultCountryCode: "in",

  // Stripe publishable key (if using Stripe)
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",

  // PayPal client ID (if using PayPal)
  paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",

  // Razorpay key (for Indian payments)
  razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "",
}

// Validate required environment variables
export function validateMedusaConfig() {
  const requiredVars = ["NEXT_PUBLIC_MEDUSA_BACKEND_URL", "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing MedusaJS environment variables: ${missingVars.join(", ")}`)
  }

  return missingVars.length === 0
}
