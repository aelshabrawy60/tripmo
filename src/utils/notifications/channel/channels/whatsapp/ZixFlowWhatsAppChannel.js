import axios from "axios";
import WhatsAppChannel from "./WhatsAppChannel";

// ZixFlow implementation with improved error handling
export class ZixFlowWhatsAppChannel extends WhatsAppChannel {
  constructor(config) {
    super();
    this.senderPhoneId = config?.senderPhoneId || "231065823421330";
    this.apiKey = config?.apiKey || "9bbabb974c78356b98603f5056d2aa763c7f3cb9d174919abb4214b76852bbab4f6fd326db28db97";
    this.maxRetries = config?.maxRetries || 3;
    this.timeout = config?.timeout || 30000; // 30 seconds
    this.retryDelay = config?.retryDelay || 2000; // 2 seconds
  }

  // Helper method to wait/delay
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper method to make HTTP request with retries
  async makeRequest(payload, attempt = 1) {
    try {
      console.log(`[ZixFlow] Attempt ${attempt} - Sending request...`);
      
      const response = await axios({
        method: "post",
        url: "https://api.zixflow.com/api/v1/campaign/whatsapp/send",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "ZixFlow-WhatsApp-Client/1.0",
          "Accept": "application/json",
          "Connection": "keep-alive",
        },
        data: payload,
        timeout: this.timeout,
        // More aggressive network settings
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
        // HTTP Agent settings for better connection handling
        httpAgent: new (require('http').Agent)({
          keepAlive: true,
          timeout: this.timeout,
        }),
        httpsAgent: new (require('https').Agent)({
          keepAlive: true,
          timeout: this.timeout,
          secureProtocol: 'TLSv1_2_method', // Force TLS 1.2
        }),
      });

      return response;
    } catch (error) {
      console.log(`[ZixFlow] Attempt ${attempt} failed:`, error.code || error.message);
      
      // Check if we should retry
      if (attempt < this.maxRetries && this.shouldRetry(error)) {
        console.log(`[ZixFlow] Retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.makeRequest(payload, attempt + 1);
      }
      
      throw error;
    }
  }

  // Determine if an error should trigger a retry
  shouldRetry(error) {
    const retryableErrors = [
      'ETIMEDOUT',
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED',
      'EHOSTUNREACH',
      'EPIPE',
      'EAI_AGAIN'
    ];
    
    const retryableMessages = [
      'socket disconnected',
      'connection was established',
      'network socket disconnected',
      'timeout'
    ];

    // Check error code
    if (error.code && retryableErrors.includes(error.code)) {
      return true;
    }

    // Check error message
    const errorMessage = (error.message || '').toLowerCase();
    if (retryableMessages.some(msg => errorMessage.includes(msg))) {
      return true;
    }

    // Check HTTP status codes (5xx server errors)
    if (error.response && error.response.status >= 500) {
      return true;
    }

    return false;
  }

  async sendMessage({ to, template }) {
    const payload = {
      to,
      phoneId: this.senderPhoneId,
      templateName: template.name,
      language: template.language || "en",
      variables: template.variables || {},
      submissionStatus: true,
    };

    console.log("[ZixFlow] Payload:", JSON.stringify(payload, null, 2));
    
    try {
      const response = await this.makeRequest(payload);

      // Check if response indicates success
      if (response.status >= 200 && response.status < 300) {
        console.log(`[ZixFlow] ✅ WhatsApp sent to ${to}: ${template.name}`);
        return {
          success: true,
          messageId: response.data?.messageId || `zixflow_${Date.now()}`,
          response: response.data,
        };
      } else {
        console.log(`[ZixFlow] ❌ API returned status ${response.status}:`, response.data);
        return {
          success: false,
          error: `API returned status ${response.status}: ${JSON.stringify(response.data)}`,
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data || error.message || 'Unknown error';
      console.error("[ZixFlow] ❌ Final error after retries:", errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        errorCode: error.code,
        attempts: this.maxRetries,
      };
    }
  }

  async getMessageStatus(messageId) {
    try {
      // If ZixFlow provides a status endpoint, implement it here
      // For now, return a placeholder
      return { 
        status: "sent", 
        messageId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("[ZixFlow] Error getting message status:", error.message);
      return { 
        status: "unknown", 
        messageId,
        error: error.message 
      };
    }
  }

  // Method to test connection
  async testConnection() {
    try {
      console.log("[ZixFlow] Testing connection...");
      
      // Make a simple request to test connectivity
      const response = await axios({
        method: "get",
        url: "https://api.zixflow.com/",
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        }
      });
      
      console.log("[ZixFlow] ✅ Connection test successful");
      return { success: true, status: response.status };
    } catch (error) {
      console.log("[ZixFlow] ❌ Connection test failed:", error.message);
      return { success: false, error: error.message };
    }
  }
}