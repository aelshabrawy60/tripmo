import {createDeposit, AddRefund, fetchPaymentId} from './helpers'

const KashierRedirect = require('./kashier');

const mode = "live"
const paymentGateawayConfig = {
  name: "kashier",
  type: "auto",
  key_1: process.env.KASHIER_MERCHANT_ID,
  key_2: process.env.KASHIER_PAYMENT_KEY,
  key_3: mode == "live" ? process.env.KASHIER_SECRET_KEY: process.env.KASHIER_SECRET_KEY_TEST,
  status: "active",
  mode: mode
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
  async createRedirect(gatewayName, orderDetails, lang = "ar", currency) {
    // Check if the requested gateway exists
    if (!this.gateways[gatewayName]) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }
    
    console.log(`Creating ${gatewayName} redirect for order:`, orderDetails);
          
    // Call the gateway's createPaymentRedirect method
    return await this.gateways[gatewayName].createPaymentRedirect(orderDetails, lang, currency);
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

  async payout(gatewayName, payoutData){
    // Check if the requested gateway exists
    if (!this.gateways[gatewayName]) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }

    return await this.gateways[gatewayName].payout(payoutData);
  }
  
  async getTransferStatus(gatewayName, transferId){
    if (!this.gateways[gatewayName]) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }

    return await this.gateways[gatewayName].getTransferStatus(transferId);
  }

}








/**
 * Initialize a deposit payment
 * 
 * @param {Object} bookData - The booking data with payment details
 * @param {String} type - The type of payment (unused currently)
 * @returns {Object} - The redirect information
 */
async function initDepositPayment(bookData, tracking_data = null, lang = 'ar', currency = "EGP" , gatewayConfig = paymentGateawayConfig) {
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
    const redirectData = await paymentService.createRedirect(gatewayConfig.name, paymentData, lang, currency);
    const deposit = await createDeposit(bookData, redirectData.redirectUrl, redirectData.paymentId, gatewayConfig.name, tracking_data)

    return redirectData;
  } catch (error) {
    console.error("Payment initialization failed:", error);
    throw error;
  }
}


async function initManualDepositPayment(bookData) {
  const paymentId = generatePaymentId(bookData.client_phone, bookData.id)
  const deposit = await createDeposit(bookData, paymentId, paymentId, "manual")

  return paymentId
}

async function initRefund(bookId, amount = null, gatewayConfig = paymentGateawayConfig) {
  const paymentService = new PaymentRedirectFlow(gatewayConfig);
  const refundData = await paymentService.createRefund(gatewayConfig.name, bookId, amount);

  
  const refund = await AddRefund(bookId, refundData.status, amount, refundData.data.response.transactionId);
  
  if (!refund) {
    throw new Error("Failed to create refund record");
  }
  return refundData;
}

async function initManualRefund(bookId, amount = null) {
  const refund = await AddRefund(bookId, "PENDING", amount, bookId);

  if (!refund) {
    throw new Error("Failed to create refund record");
  }

  return refund
}

async function initPayout(payoutData, gatewayConfig = paymentGateawayConfig) {
  const paymentService = new PaymentRedirectFlow(gatewayConfig);
  const payoutData_ = paymentService.payout(gatewayConfig.name, payoutData)

  return payoutData_
}

async function getWithdrawStatus(transferId, gatewayConfig = paymentGateawayConfig) {
  const paymentService = new PaymentRedirectFlow(gatewayConfig);
  const transfareStatus = paymentService.getTransferStatus(gatewayConfig.name, transferId)
  return transfareStatus
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
  initManualRefund,
  initPayout,
  paymentGateawayConfig,
  getWithdrawStatus
};