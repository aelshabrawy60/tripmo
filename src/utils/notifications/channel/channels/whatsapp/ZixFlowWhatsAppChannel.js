import axios from "axios";
import WhatsAppChannel from "./WhatsAppChannel";

// ZixFlow implementation
export class ZixFlowWhatsAppChannel extends WhatsAppChannel {
  constructor(config) {
    super();
    this.senderPhoneId = config?.senderPhoneId || "231065823421330";
    this.apiKey = config?.apiKey || "9bbabb974c78356b98603f5056d2aa763c7f3cb9d174919abb4214b76852bbab4f6fd326db28db97";
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


    console.log("payload", payload)
    try {
      const response = await axios({
        method: "post",
        url: "https://api.zixflow.com/api/v1/campaign/whatsapp/send",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(payload),
      });

      console.log(`[ZixFlow] WhatsApp to ${to}: ${template.name}`);
      return {
        success: true,
        messageId: response.data?.messageId || "zixflow_msg_id_placeholder",
        response: response.data,
      };
    } catch (error) {
      console.log("[ZixFlow] Error sending message:", error.response?.data || error.message)
      console.error("[ZixFlow] Error sending message:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  async getMessageStatus(messageId) {
    // ZixFlow may not support status lookup directly. Placeholder:
    return { status: "read", messageId };
  }
}