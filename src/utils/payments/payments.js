import {createDeposit} from './helpers'

const KashierRedirect = require('./kashier');

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

    return await this.gateways[gatewayName].getPaymentStatus(paymentId)
  }
}








/**
 * Initialize a deposit payment
 * 
 * @param {Object} bookData - The booking data with payment details
 * @param {String} type - The type of payment (unused currently)
 * @returns {Object} - The redirect information
 */
async function initDepositPayment(bookData, type, gatewayConfig) {
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
    const redirectData = await paymentService.createRedirect(type, paymentData);
    const deposit = await createDeposit(bookData.group_id, bookData.bookable_id, bookData.id, bookData.deposite_price, redirectData.redirectUrl, redirectData.paymentId, type)

    return redirectData;
  } catch (error) {
    console.error("Payment initialization failed:", error);
    throw error;
  }
}

module.exports = {
  PaymentRedirectFlow,
  initDepositPayment
};