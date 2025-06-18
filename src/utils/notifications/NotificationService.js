import { ChannelDispatcher } from "./channel/ChannelDispatcher";


export default class NotificationService{

    // channels [whatsapp]
    constructor(config){
        this.dispatcher = new ChannelDispatcher(config)
    }

    async sendMessage(channelName, to, message){
        return null
    }

    async sendBookConfirmation(channelName, to){
        const template = {
            name: "opt_in_message"
        }
        console.log("sending confirmation")
        
        const result = await this.dispatcher.sendMessage(channelName, {to, template})

        return result
    }
}