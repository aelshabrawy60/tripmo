import { ChannelDispatcher } from "./channel/ChannelDispatcher";


export default class NotificationService{

    // channels [whatsapp]
    constructor(config){
        this.dispatcher = new ChannelDispatcher(config)
    }

    async sendMessage(channelName, to, message){
        return null
    }

    async sendBookConfirmation(channelName, to, bookData, hostNumber) {
        console.log("sending confirmation", bookData , hostNumber);

        // Define both templates
        const clientTemplate = { name: "opt_in_message" };
        const hostTemplate = { name: "hello_text" };

        // Send both messages in parallel
        const [clientResult, hostResult] = await Promise.all([
            this.dispatcher.sendMessage(channelName, { to, template: clientTemplate }),
            this.dispatcher.sendMessage(channelName, { to: hostNumber, template: hostTemplate })
        ]);

        return { clientResult, hostResult };
    }

}