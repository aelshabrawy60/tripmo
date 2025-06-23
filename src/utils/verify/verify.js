class MessageBirdVerify {
  constructor(config) {
    this.baseUrl = config.baseUrl || 'https://api.bird.com';
    this.workspaceId = config.workspaceId;
    this.accessToken = config.accessToken;
    this.whatsappChannelId = config.whatsappChannelId;
    this.smsChannelId = config.smsChannelId;
    this.whatsappNavigatorId = config.whatsappNavigatorId; // Optional: Use navigator instead of channel
    this.smsNavigatorId = config.smsNavigatorId; // Optional: Use navigator instead of channel
  }

  /**
   * Send verification code with WhatsApp first, SMS as fallback
   * @param {string} phoneNumber - Phone number in international format (e.g., "+31623456789")
   * @param {Object} options - Additional options
   * @param {string} options.locale - Language locale (default: "en-US")
   * @param {number} options.maxAttempts - Max verification attempts (default: 3)
   * @param {number} options.timeout - Timeout in seconds (default: 600)
   * @param {number} options.codeLength - Length of verification code (default: 6)
   * @param {Object} options.whatsappTemplate - WhatsApp template configuration
   * @returns {Promise<Object>} Verification response
   */
  async sendVerification(phoneNumber, options = {}) {
    const {
      locale = "en",
      maxAttempts = 2,
      timeout = 600,
      codeLength = 4,
      whatsappTemplate = {
        "projectId": "cacd0dcd-2d18-4b9f-a112-5d5fc7307dd9",
        "version": "latest",
        "locale": "en"
      }
    } = options;

    const steps = [];

    // Step 1: WhatsApp (primary)
    const whatsappStep = this.whatsappNavigatorId 
      ? { navigatorId: this.whatsappNavigatorId }
      : { channelId: this.whatsappChannelId };

    if (whatsappTemplate) {
      whatsappStep.template = whatsappTemplate;
    }
    steps.push(whatsappStep);

    // Step 2: SMS (failover)
    const smsStep = this.smsNavigatorId 
      ? { navigatorId: this.smsNavigatorId }
      : { channelId: this.smsChannelId };
    

    //steps.push(smsStep);

    console.log("phone", phoneNumber)

    const requestBody = {
      identifier: {
        phonenumber: "+" + phoneNumber
      },
      locale,
      maxAttempts,
      timeout,
      codeLength,
      steps
    };

    try {
      const response = await this.makeRequest('POST', `/workspaces/${this.workspaceId}/verify`, requestBody);
      return {
        success: true,
        data: response,
        verificationId: response.id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Verify the code entered by user
   * @param {string} verificationId - ID returned from sendVerification
   * @param {string} code - Code entered by user
   * @returns {Promise<Object>} Verification result
   */
  async verifyCode(verificationId, code) {
    try {
      const response = await this.makeRequest('POST', `/workspaces/${this.workspaceId}/verify/${verificationId}`, {
        code
      });
      
      return {
        success: true,
        verified: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        verified: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Resend verification code for current step
   * @param {string} verificationId - ID returned from sendVerification
   * @param {number} stepIndex - Optional: specific step index to resend
   * @returns {Promise<Object>} Resend result
   */
  async resendCode(verificationId, stepIndex = null) {
    const requestBody = stepIndex !== null ? { stepIndex } : {};

    try {
      const response = await this.makeRequest('POST', `/workspaces/${this.workspaceId}/verify/${verificationId}/resend`, requestBody);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Manually trigger failover to next step (SMS)
   * @param {string} verificationId - ID returned from sendVerification
   * @param {number} stepIndex - Optional: specific step index to failover to
   * @returns {Promise<Object>} Failover result
   */
  async failoverToSMS(verificationId, stepIndex = null) {
    const requestBody = stepIndex !== null ? { stepIndex } : {};

    try {
      const response = await this.makeRequest('POST', `/workspaces/${this.workspaceId}/verify/${verificationId}/failover`, requestBody);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Get verification status
   * @param {string} verificationId - ID returned from sendVerification
   * @returns {Promise<Object>} Verification status
   */
  async getVerificationStatus(verificationId) {
    try {
      const response = await this.makeRequest('GET', `/workspaces/${this.workspaceId}/verify/${verificationId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Get list of verifications
   * @param {Object} options - Query options
   * @returns {Promise<Object>} List of verifications
   */
  async getVerifications(options = {}) {
    const queryParams = new URLSearchParams();
    
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.pageToken) queryParams.append('pageToken', options.pageToken);
    if (options.reverse) queryParams.append('reverse', options.reverse);
    if (options.startAt) queryParams.append('startAt', options.startAt);
    if (options.endAt) queryParams.append('endAt', options.endAt);

    const queryString = queryParams.toString();
    const endpoint = `/workspaces/${this.workspaceId}/verify${queryString ? '?' + queryString : ''}`;

    try {
      const response = await this.makeRequest('GET', endpoint);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Make HTTP request to MessageBird API
   * @private
   */
  async makeRequest(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log("url", url)
    console.log("body", body)
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const config = {
      method,
      headers
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    const responseData = await response.json();

    console.log("response data", responseData)

    if (!response.ok) {
      const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
      error.response = { data: responseData };
      throw error;
    }

    return responseData;
  }
}

// Example usage
/*
// Initialize the utility
const verifyService = new MessageBirdVerify({
  baseUrl: 'https://api.messagebird.com', // Optional, defaults to this
  workspaceId: 'bdd3106f-494d-4c51-ba93-8805b29043c3',
  accessToken: 'gPD8wRMLUu8Wb8uovgsPSDumy95J0gcSIS1z',
  whatsappChannelId: '668ac043-1eff-55a7-9536-a9c35b5afbb4',
  smsChannelId: 'your-sms-channel-id',
  // OR use navigators (recommended):
  // whatsappNavigatorId: 'your-whatsapp-navigator-id',
  // smsNavigatorId: 'your-sms-navigator-id'
});

// Send verification code
async function sendOTP() {
  const result = await verifyService.sendVerification('+31623456789', {
    locale: 'en-US',
    maxAttempts: 3,
    timeout: 300, // 5 minutes
    codeLength: 6,
    // Optional WhatsApp template
    whatsappTemplate: {
      projectId: 'TEMPLATE_UUID',
      version: 'latest',
      locale: 'en'
    }
  });

  if (result.success) {
    console.log('Verification sent:', result.verificationId);
    return result.verificationId;
  } else {
    console.error('Failed to send verification:', result.error);
  }
}

// Verify the code
async function verifyOTP(verificationId, userCode) {
  const result = await verifyService.verifyCode(verificationId, userCode);
  
  if (result.success && result.verified) {
    console.log('Code verified successfully!');
    return true;
  } else {
    console.log('Invalid code:', result.error);
    return false;
  }
}

// Check verification status
async function checkStatus(verificationId) {
  const result = await verifyService.getVerificationStatus(verificationId);
  
  if (result.success) {
    console.log('Current step:', result.data.currentStepIndex);
    console.log('Status:', result.data.status);
    console.log('Failed attempts:', result.data.failedAttempts);
  }
}

// Manually trigger SMS failover if needed
async function forceFailoverToSMS(verificationId) {
  const result = await verifyService.failoverToSMS(verificationId);
  
  if (result.success) {
    console.log('Successfully failed over to SMS');
  } else {
    console.error('Failover failed:', result.error);
  }
}
*/

export default MessageBirdVerify;