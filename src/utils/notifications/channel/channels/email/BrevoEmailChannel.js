import EmailChannel from "./EmailChannel";

export class BrevoEmailChannel extends EmailChannel {
  constructor(config) {
    super();
    this.apiKey = config?.apiKey || "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";
    this.baseUrl = `https://api.brevo.com/v3/smtp/email`;
  }

  async sendMessage(messagePayload) {
    const payload = {
      sender: {
        name: messagePayload?.senderName,
        email: messagePayload?.senderEmail,
      },
      to: [
        {
          email: messagePayload?.recipientEmail,
          name: messagePayload?.recipientName,
        },
      ],
      subject: messagePayload?.subject,
      htmlContent: messagePayload?.htmlContent,
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo send email failed: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }

  async getMessageStatus(messageId) {
    // If you want status retrieval, you’d need to use Brevo's event webhooks or message logs endpoint
    throw new Error("Message status retrieval not implemented");
  }
}
