import AbstractChannel from "../../AbstractChannel";

export default class EmailChannel extends AbstractChannel {
  constructor(config) {
    super(config);
    if (new.target === EmailChannel) {
      throw new Error("Cannot instantiate EmailChannel directly");
    }
  }

  async sendMessage(messagePayload) {
    throw new Error("sendMessage() must be implemented in WhatsApp provider");
  }

  async getMessageStatus(messageId) {
    throw new Error("getMessageStatus() must be implemented in WhatsApp provider");
  }
}
