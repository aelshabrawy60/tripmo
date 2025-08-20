const crypto = require('crypto');
import {
    ApiError,
    CheckoutPaymentIntent,
    Client,
    Environment,
    LogLevel,
    OrdersController,
    PaymentsController,
} from "@paypal/paypal-server-sdk";

class Paypal {
  constructor(config) {
    this.PAYPAL_CLIENT_ID = config.key_1;
    this.PAYPAL_CLIENT_SECRET = config.key_2;
    this.mode = config.mode || "test";
    this.client = new Client({
        clientCredentialsAuthCredentials:{
            oAuthClientId: this.PAYPAL_CLIENT_ID,
            oAuthClientSecret: this.PAYPAL_CLIENT_SECRET
        },
        timeout: 0,
        environment: this.mode === "live" ? Environment.LIVE : Environment.Sandbox, 
        logging: {
            logLevel: LogLevel.Info,
            logRequest: { logBody: true },
            logResponse: { logHeaders: true },
        },
    });
    this.OrdersController = new OrdersController(this.client);
    this.PaymentsController = new PaymentsController(this.client);
   }

  async createPaymentRedirect(orderDetails, lang = 'ar', currency = "EGP") {
    this.validateOrderDetails(orderDetails);

    const collect ={
        
    }

    // Validate currency, fallback to EGP
    if (currency !== "EGP" && currency !== "USD") {
      currency = "EGP";
    }
    const priceInCurrency = orderDetails.deposite_price * (exchangeRates[currency] || 1);


    const amount = parseFloat(priceInCurrency).toFixed(2);
    const orderId = String(orderDetails.id);

    const payload = {
      expireAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      maxFailureAttempts: 3,
      paymentType: "credit",
      amount,
      currency: "EGP",
      order: orderId,
      merchantRedirect: encodeURI(this.successUrl),
      display: lang,
      type: "one-time",
      merchantId: this.merchantId,
      failureRedirect: false,
      customer: {
        reference: orderDetails.customerReference || orderId
      },
      serverWebhook: "https://tripmo.vercel.app/api/webhook/deposits"
    };

    try {
      const response = await fetch(this.kashierCreateApi, {
        method: "POST",
        headers: {
          "Authorization": this.secretKey,
          "api-key": this.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("error data", errorData)

        throw new Error(`Kashier API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Payment session created:", result);

      return {
        "redirectUrl": result.sessionUrl,
        "paymentId": result._id
      }

    } catch (error) {
      console.error("Error creating Kashier session:", error);
      throw error;
    }
  }

  validateOrderDetails(order) {
    if (!order) throw new Error("Order details are required");
    if (!order.id) throw new Error("Order ID is required");
    if (!order.deposite_price) throw new Error("Order amount (deposite_price) is required");

    const amount = parseFloat(order.deposite_price);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid order amount");
    }
  }

  async verifyReturnedPayment(query) {
    let queryString = '';
    for (let key in query) {
      if (key === 'signature' || key === 'mode') continue;
      queryString += '&' + key + '=' + query[key];
    }
    let finalUrl = queryString.substr(1);

    const calculatedSignature = crypto
      .createHmac('sha256', this.apiKey)
      .update(finalUrl)
      .digest('hex');

    const isValid = calculatedSignature === query.signature;

    return {
      success: isValid && query.paymentStatus === 'SUCCESS',
      isSignatureValid: isValid
    };
  }

  async getStatusPayment(paymentId){
    const response = await fetch(`${this.kashierGetApi}/payment/sessions/${paymentId}/payment`, {
      method: "GET",
      headers: {
        "Authorization": this.secretKey,
      },
    });

    

    const result = await response.json();

    if(result.message == "success"){
      return true
    }

    return false
  }

  async createRefund(paymentId, amount = null) {
    const orderId = paymentId;
    let reason = "Refund requested by customer";

    try {
      // Validate required parameters
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      if (!this.secretKey) {
        throw new Error('Secret key is required');
      }

      // Prepare request body
      const requestBody = {
        apiOperation: 'REFUND',
        reason: reason
      };

      // Add amount for partial refunds
      if (amount !== null) {
        if (amount <= 0) {
          throw new Error('Refund amount must be greater than 0');
        }
        requestBody.transaction = { amount: amount };
      }

      // Prepare request options
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': this.secretKey,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      };

      // Make API request
      const response = await fetch(`${this.kashierCreateRefund}/orders/${orderId}`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
            
      return {
        success: true,
        data: data,
        status: data.status,
        message: data.messages
      };

    } catch (error) {
      throw new error(error.message || 'An error occurred while creating the refund');
    }
  }

  async getTransferStatus(transferId){
    const url = `${this.kashierTransfareStatus}${transferId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.secretKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.status; // You can also return specific fields like data.status if needed
    } catch (error) {
      console.error('Error fetching transfer status:', error.message);
      throw error;
    }
  }

}

module.exports = Paypal;
