import AbstractChannel from "../../AbstractChannel";

export default class WhatsAppChannel extends AbstractChannel {
  constructor(config) {
    super(config);
    if (new.target === WhatsAppChannel) {
      throw new Error("Cannot instantiate WhatsAppChannel directly");
    }
  }

  async sendMessage(messagePayload) {
    throw new Error("sendMessage() must be implemented in WhatsApp provider");
  }

  async getMessageStatus(messageId) {
    throw new Error("getMessageStatus() must be implemented in WhatsApp provider");
  }
}
