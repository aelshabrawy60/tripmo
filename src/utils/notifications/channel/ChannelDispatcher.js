import { MessageBirdWhatsAppChannel } from "./channels/whatsapp/MessageBirdWhatsAppChannel";
import { BrevoEmailChannel } from "./channels/email/BrevoEmailChannel";
export class ChannelDispatcher {
  constructor(config) {
    this.channels = {
      whatsapp: new MessageBirdWhatsAppChannel(config), // Or MessageBirdWhatsAppChannel
      email: new BrevoEmailChannel(config),
      // sms: new SMSChannel(config),
    };
  }

  async sendMessage(channelName, payload) {
    if (!this.channels[channelName]) {
      throw new Error(`Channel ${channelName} not configured`);
    }

    return await this.channels[channelName].sendMessage(payload);
  }

  async getMessageStatus(channelName, messageId) {
    if (!this.channels[channelName]) {
      throw new Error(`Channel ${channelName} not configured`);
    }

    return await this.channels[channelName].getMessageStatus(messageId);
  }
}
