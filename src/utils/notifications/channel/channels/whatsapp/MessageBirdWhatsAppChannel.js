import axios from "axios";
import WhatsAppChannel from "./WhatsAppChannel";

// MessageBird (Bird.com) implementation
export class MessageBirdWhatsAppChannel extends WhatsAppChannel {
  constructor(config) {
    super();
    this.accessToken = config?.accessToken || "gPD8wRMLUu8Wb8uovgsPSDumy95J0gcSIS1z";
    this.workspaceId = config?.workspaceId || "bdd3106f-494d-4c51-ba93-8805b29043c3";
    this.channelId = config?.channelId || "eca0238b-291e-5f0c-8c40-f45a1ac64d50";
    this.baseUrl = `https://api.bird.com/workspaces/${this.workspaceId}/channels/${this.channelId}`;
  }

  async sendMessage({ to, template }) {
    // Convert template variables to MessageBird parameters format
    const parameters = [];
    if (template.variables && typeof template.variables === 'object') {
      Object.entries(template.variables).forEach(([key, value]) => {
        parameters.push({
          type: "string",
          key: key,
          value: String(value)
        });
      });
    }

    const payload = {
      receiver: {
        contacts: [
          {
            identifierKey: "phonenumber",
            identifierValue: "+" + to
          }
        ]
      },
      template: {
        projectId: template.name,
        version: template.version || "latest",
        locale: template.language || "en",
        parameters: parameters
      }
    };

    // Add optional fields if provided
    if (template.variables && template.variables.default) {
      payload.template.variables = {
        default: template.variables.default,
        ...template.variables
      };
    }

    // Add reference for tracking
    if (template.reference) {
      payload.reference = template.reference;
    }

    console.log("MessageBird payload", JSON.stringify(payload, null, 2));

    try {
      const response = await axios({
        method: "post",
        url: `${this.baseUrl}/messages`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        data: payload,
      });

      console.log(`[MessageBird] WhatsApp to ${to}: ${template.name}`);
      return {
        success: true,
        messageId: response.data?.id || "messagebird_msg_id_placeholder",
        channelId: response.data?.channelId,
        status: response.data?.status,
        response: response.data,
      };
    } catch (error) {
      console.log("[MessageBird] Error sending message:", error.response?.data || error.message);
      console.error("[MessageBird] Error sending message:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  async getMessageStatus(messageId) {
    try {
      const response = await axios({
        method: "get",
        url: `${this.baseUrl}/messages/${messageId}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        status: response.data?.status || "unknown",
        messageId: messageId,
        lastStatusAt: response.data?.lastStatusAt,
        response: response.data,
      };
    } catch (error) {
      console.error("[MessageBird] Error getting message status:", error.response?.data || error.message);
      return {
        success: false,
        status: "unknown",
        messageId: messageId,
        error: error.response?.data || error.message,
      };
    }
  }

  // Check if customer care window is active for a contact
  async getContactChannelDetails(contactId) {
    try {
      const response = await axios({
        method: "get",
        url: `${this.baseUrl}/contacts/${contactId}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        contact: response.data,
        canSendFreeform: response.data?.canSendFreeform || false,
        customerCareWindowExpiry: response.data?.customerCareWindowExpiry || null,
      };
    } catch (error) {
      console.error("[MessageBird] Error getting contact details:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  // Send a freeform text message (only works within 24h customer care window)
  async sendTextMessage({ to, text, attachments = [] }) {
    const payload = {
      receiver: {
        contacts: [
          {
            identifierKey: "phonenumber",
            identifierValue: to
          }
        ]
      },
      body: {
        type: "text",
        text: {
          text: text,
          attachments: attachments
        }
      }
    };

    try {
      const response = await axios({
        method: "post",
        url: `${this.baseUrl}/messages`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        data: payload,
      });

      console.log(`[MessageBird] WhatsApp text to ${to}: ${text.substring(0, 50)}...`);
      return {
        success: true,
        messageId: response.data?.id || "messagebird_msg_id_placeholder",
        channelId: response.data?.channelId,
        status: response.data?.status,
        response: response.data,
      };
    } catch (error) {
      console.log("[MessageBird] Error sending text message:", error.response?.data || error.message);
      console.error("[MessageBird] Error sending text message:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }
}