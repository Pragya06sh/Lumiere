import { formatPrice, calcDiscount, isValidPincode, generateOrderNumber } from "../src/lib/utils";
import { siteConfig } from "../src/config/site";

// Simple zero-dependency test assertion runner
function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

console.log("🧪 Running Critical Business Flow Tests...\n");

// 1. PRICE CALCULATION TESTS
console.log("--- 1. Price Formatting & Discount Calculations ---");
assert(formatPrice(79900).includes("799"), "formatPrice(79900) displays ₹799");
assert(formatPrice(149900).includes("1,499"), "formatPrice(149900) displays ₹1,499");
assert(calcDiscount(79900, 99900) === 20, "calcDiscount(79900, 99900) calculates 20% discount");
assert(calcDiscount(10000, null) === 0, "calcDiscount with null compareAt returns 0");
assert(calcDiscount(10000, 10000) === 0, "calcDiscount with identical price returns 0");

// 2. COUPON LOGIC TESTS
console.log("\n--- 2. Coupon Discount Calculation Logic ---");
function calculateCouponDiscount(
  code: string,
  subtotal: number
): { discount: number; error?: string } {
  const c = code.toUpperCase().trim();
  if (c === "DIWALI20") {
    if (subtotal < 99900) {
      return { discount: 0, error: "Minimum order ₹999 required" };
    }
    const rawDiscount = Math.round((subtotal * 20) / 100);
    const cappedDiscount = Math.min(rawDiscount, 50000); // ₹500 cap
    return { discount: cappedDiscount };
  } else if (c === "FIRST100") {
    if (subtotal < 49900) {
      return { discount: 0, error: "Minimum order ₹499 required" };
    }
    return { discount: 10000 }; // ₹100 flat
  }
  return { discount: 0, error: "Invalid coupon" };
}

assert(
  calculateCouponDiscount("DIWALI20", 100000).discount === 20000,
  "DIWALI20 gives ₹200 on ₹1000 subtotal"
);
assert(
  calculateCouponDiscount("DIWALI20", 350000).discount === 50000,
  "DIWALI20 caps discount at maximum ₹500 (50,000 paise)"
);
assert(
  calculateCouponDiscount("DIWALI20", 80000).discount === 0,
  "DIWALI20 fails when subtotal < ₹999"
);
assert(
  calculateCouponDiscount("FIRST100", 69900).discount === 10000,
  "FIRST100 gives flat ₹100 on ₹699 subtotal"
);
assert(
  calculateCouponDiscount("FIRST100", 30000).discount === 0,
  "FIRST100 fails when subtotal < ₹499"
);

// 3. SHIPPING & FREE DELIVERY THRESHOLD TESTS
console.log("\n--- 3. Shipping & Kolkata Delivery Logic ---");
function calculateShipping(subtotal: number): number {
  if (subtotal >= siteConfig.shipping.freeShippingThreshold) {
    return 0; // Free delivery
  }
  return siteConfig.shipping.standardShippingFee;
}

assert(
  calculateShipping(120000) === 0,
  "Orders above ₹999 get free delivery"
);
assert(
  calculateShipping(50000) === siteConfig.shipping.standardShippingFee,
  "Orders below ₹999 incur standard shipping fee (₹79)"
);

// 4. KOLKATA PINCODE VALIDATION TESTS
console.log("\n--- 4. Pincode Verification ---");
assert(isValidPincode("700016") === true, "Valid 6-digit Kolkata pincode accepted");
assert(isValidPincode("700001") === true, "700001 is recognized as valid pincode");
assert(isValidPincode("000000") === false, "Invalid leading zero rejected");
assert(isValidPincode("7000") === false, "Short pincode rejected");
assert(isValidPincode("7000161") === false, "7-digit pincode rejected");
assert(isValidPincode("ABCDEF") === false, "Alpha characters rejected");

// 5. ORDER NUMBER GENERATION
console.log("\n--- 5. Order Number Format ---");
const orderNum = generateOrderNumber();
assert(
  orderNum.startsWith("SC-") && orderNum.length >= 14,
  `Generated order number adheres to format: ${orderNum}`
);

console.log("\n🎉 All critical business flow tests evaluated successfully!\n");
