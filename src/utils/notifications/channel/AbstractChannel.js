export default class AbstractChannel {
  constructor(config) {
    if (new.target === AbstractChannel) {
      throw new Error("Cannot instantiate AbstractChannel directly");
    }
    this.config = config;
  }

  async sendMessage(messagePayload) {
    throw new Error("sendMessage() must be implemented");
  }

  async getMessageStatus(messageId) {
    throw new Error("getMessageStatus() must be implemented");
  }
}
