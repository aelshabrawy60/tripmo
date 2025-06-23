
// File: lib/messagebird.js
// MessageBird utility instance
import MessageBirdVerify from "../utils/verify/verify";
//
const verifyService = new MessageBirdVerify({
  workspaceId: 'bdd3106f-494d-4c51-ba93-8805b29043c3',
  accessToken: 'gPD8wRMLUu8Wb8uovgsPSDumy95J0gcSIS1z',
  whatsappChannelId: 'eca0238b-291e-5f0c-8c40-f45a1ac64d50',
  smsChannelId: 'your-sms-channel-id',
});

export default verifyService;