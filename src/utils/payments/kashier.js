const crypto = require('crypto');

class KashierRedirect {
  constructor(config) {
    this.successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/booking`;
    this.cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/booking?paymentStatus=cancelled`;
    this.merchantId = config.key_1;
    this.apiKey = config.key_2;
    this.secretKey = config.key_3;
    this.mode = config.mode || "test";
    this.kashierCreateApi = this.mode == "test" ? "https://test-api.kashier.io/v3/payment/sessions" : "https://api.kashier.io/v3/payment/sessions"
    this.kashierGetApi = this.mode == "test" ? "https://test-api.kashier.io/v3" : "https://api.kashier.io/v3"
    this.kashierCreateRefund = this.mode == "test" ? "https://test-fep.kashier.io/v3" : "https://fep.kashier.io/v3"
    this.kashierPayout = this.mode == "test" ? "https://test-fep.kashier.io/v3/transfers/single" : "https://fep.kashier.io/v3/transfers/single"
    this.kashierTransfareStatus = this.mode == "test" ? "https://test-api.kashier.io/v2/transfers/":  "https://api.kashier.io/v2/transfers/"
  }

  generateKashierOrderHash(order) {
    if (!order || !order.id || !order.deposite_price) {
      throw new Error("Missing required order details");
    }

    const mid = this.merchantId;
    const orderId = String(order.id);
    const amount = parseFloat(order.deposite_price).toFixed(2);
    const currency = "EGP";

    const path = `/?payment=${mid}.${orderId}.${amount}.${currency}`;
    const hash = crypto.createHmac('sha256', this.apiKey).update(path).digest('hex');
    return hash;
  }

  async createPaymentRedirect(orderDetails) {
    this.validateOrderDetails(orderDetails);

    const amount = parseFloat(orderDetails.deposite_price).toFixed(2);
    const orderId = String(orderDetails.id);

    const payload = {
      expireAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      maxFailureAttempts: 3,
      paymentType: "credit",
      amount,
      currency: "EGP",
      order: orderId,
      merchantRedirect: encodeURI(this.successUrl),
      display: "ar",
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

  async payout(payoutData) {

    const merchant_id = payoutData.merchantTransferId + "_merchant"

    try {
      const response = await fetch(this.kashierPayout, {
        method: 'POST',
        headers: {
          'Authorization': this.secretKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: payoutData.amount,
          method: payoutData.method, // "wallet", "bank", "card", or "instant wallet"
          recipientName: payoutData.recipientName,
          merchantTransferId: merchant_id,
          recipientBank: payoutData.recipientBank,
          recipientNumber: payoutData.recipientNumber,
          serverWebhook: "https://tripmo.vercel.app/api/webhook/payouts"
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log("error data", errorData)
        throw new Error(`Transfer failed: ${errorData.messages?.en || 'Unknown error'}`);
      }

      const result = await response.json();

      console.log("result", result)
      return result;

    } catch (error) {
      console.error('Error during payout:', error.message);
      throw error;
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

module.exports = KashierRedirect;
