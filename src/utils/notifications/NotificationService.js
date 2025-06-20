import { ChannelDispatcher } from "./channel/ChannelDispatcher";
import { supabaseAdmin } from "../supabase/service";

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
        const clientTemplate = { name: "cacd0dcd-2d18-4b9f-a112-5d5fc7307dd9" , variables: {otp: 5673}};
        const hostTemplate = { name: "cacd0dcd-2d18-4b9f-a112-5d5fc7307dd9" , variables: {otp: 5673}};

        // Send both messages in parallel
        const [clientResult, hostResult] = await Promise.all([
            this.dispatcher.sendMessage(channelName, { to, template: clientTemplate }),
            this.dispatcher.sendMessage(channelName, { to: hostNumber, template: hostTemplate })
        ]);

        return { clientResult, hostResult };
    }

    async sendBookCancellation(channelName, bookId){
        console.log("sending cancellation" );

        const bookData = await fetchBookData(bookId)
        const hostNumber = bookData.Group.notifications_number
        const to = bookData.clients.phone
        // Define both templates
        const clientTemplate = { name: "opt_in_message" };
        const hostTemplate = { name: "hello_text" };

        // Send both messages in parallel
        console.log("hi")
        const [clientResult, hostResult] = await Promise.all([
            this.dispatcher.sendMessage(channelName, { to, template: clientTemplate }),
            this.dispatcher.sendMessage(channelName, { to: hostNumber, template: hostTemplate })
        ]);

        return { clientResult, hostResult };
    }

}


async function fetchBookData(bookId) {
    const {data, error} = await supabaseAdmin.from("bookings")
        .select("*, Group(notifications_number), clients(phone)")
        .eq('id', bookId)
        .single()

    if(error){
        console.log(error)
    }

    return data
}