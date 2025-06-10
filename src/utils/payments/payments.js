import {createDeposit, AddRefund, fetchPaymentId} from './helpers'

const KashierRedirect = require('./kashier');

const paymentGateawayConfig = {
  name: "kashier",
  type: "auto",
  key_1: "MID-34194-211",
  key_2: "31978aa5-1378-464a-b34f-6bb4653ba2ec",
  key_3: "be73f1e6187aee67e47f5aa2eab6f6c6$a88c240bebf4b5802b26759dcb552125cea354a93c52ccf1f91e02106587cb3537ce8f60738d50d6bb9248e996423a94",
  status: "active",
  mode: "test"
}


class PaymentRedirectFlow {
  constructor(config) {
    this.gateways = {
      kashier: new KashierRedirect(config),
      // Add other gateways as needed
    };
  }
    
  /**
   * Create a payment redirect for the specified gateway
   * 
   * @param {String} gatewayName - The payment gateway to use
   * @param {Object} orderDetails - The order details
   * @returns {Object} - The redirect information
   */
  async createRedirect(gatewayName, orderDetails) {
    // Check if the requested gateway exists
    if (!this.gateways[gatewayName]) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }
    
    console.log(`Creating ${gatewayName} redirect for order:`, orderDetails);
          
    // Call the gateway's createPaymentRedirect method
    return await this.gateways[gatewayName].createPaymentRedirect(orderDetails);
  }
      
  /**
   * Verify a payment return from the specified gateway
   * 
   * @param {String} gatewayName - The payment gateway used
   * @param {Object} urlParams - The URL parameters from the callback
   * @returns {Object} - The verification result
   */
  async verifyPaymentReturn(gatewayName, urlParams) {
    // Check if the requested gateway exists
    if (!this.gateways[gatewayName]) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }
    
    return await this.gateways[gatewayName].verifyReturnedPayment(urlParams);
  }

  async getPaymentStatus(gatewayName, paymentId){

    if (!this.gateways[gatewayName]) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }

    return await this.gateways[gatewayName].getStatusPayment(paymentId)
  }

  async createRefund(gatewayName, paymentId, amount = null) {
    // Check if the requested gateway exists
    if (!this.gateways[gatewayName]) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }

    return await this.gateways[gatewayName].createRefund(paymentId, amount);
  }

}








/**
 * Initialize a deposit payment
 * 
 * @param {Object} bookData - The booking data with payment details
 * @param {String} type - The type of payment (unused currently)
 * @returns {Object} - The redirect information
 */
async function initDepositPayment(bookData, gatewayConfig = paymentGateawayConfig) {
  // Ensure bookData has all required fields
  if (!bookData || !bookData.id || !bookData.deposite_price) {
    throw new Error("Invalid booking data. Missing required fields.");
  }
  
  // Validate amount
  const amount = parseFloat(bookData.deposite_price);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid deposit amount");
  }
  
  // Make a copy of the booking data to avoid modifying the original
  const paymentData = { ...bookData };
  
  // Format the deposit price to ensure it has 2 decimal places
  paymentData.deposite_price = amount.toFixed(2);
    
  try {
    const paymentService = new PaymentRedirectFlow(gatewayConfig);
    const redirectData = await paymentService.createRedirect(gatewayConfig.name, paymentData);
    const deposit = await createDeposit(bookData.group_id, bookData.bookable_id, bookData.id, bookData.deposite_price, redirectData.redirectUrl, redirectData.paymentId, gatewayConfig.name)

    return redirectData;
  } catch (error) {
    console.error("Payment initialization failed:", error);
    throw error;
  }
}


async function initManualDepositPayment(bookData) {
  const paymentId = generatePaymentId(bookData.client_phone, bookData.id)
  const deposit = await createDeposit(bookData.group_id, bookData.bookable_id, bookData.id, bookData.deposite_price, paymentId, paymentId, "manual")

  return paymentId
}

async function initRefund(bookId, amount = null, gatewayConfig = paymentGateawayConfig) {
  const paymentService = new PaymentRedirectFlow(gatewayConfig);
  const refundData = await paymentService.createRefund(gatewayConfig.name, bookId, amount);

  const refund = await AddRefund(bookId, refundData.status, amount);
  
  if (!refund) {
    throw new Error("Failed to create refund record");
  }
  return refundData;
}

function generatePaymentId(phone, bookId) {
  const timestamp = Date.now(); // Current timestamp
  const uniqueString = `${phone}-${bookId.toString()}-${timestamp}`;
  
  // Generate a hash for uniqueness
  return btoa(uniqueString).replace(/[^a-zA-Z0-9]/g, '');
}

module.exports = {
  PaymentRedirectFlow,
  initDepositPayment,
  initManualDepositPayment,
  initRefund,
  paymentGateawayConfig,
};