const crypto = require('crypto');

class KashierRedirect {
  constructor(config) {
    this.successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/booking`;
    this.cancelUrl = "https://www.syncsystem.site/platform/tabels";
    this.merchantId = config.key_1;
    this.apiKey = config.key_2;
    this.secretKey = config.key_3;
    this.mode = config.mode || "test";
    this.kashierCreateApi = this.mode == "test" ? "https://test-api.kashier.io/v3/payment/sessions" : "https://api.kashier.io/v3/payment/sessions"
    this.kashierGetApi = this.mode == "test" ? "https://test-api.kashier.io/v3" : "https://api.kashier.io/v3"
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
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
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

  async getPaymentStatus(paymentId){
    const response = await fetch(`${this.kashierGetApi}/payment/sessions/${paymentId}/payment`, {
      method: "GET",
      headers: {
        "Authorization": this.secretKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Kashier API error: ${response.statusText}`);
    }

    const result = await response.json();

    if(result.message == "success"){
      return true
    }

    return false
  }
}

module.exports = KashierRedirect;
