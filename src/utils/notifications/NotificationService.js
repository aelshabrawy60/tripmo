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
        const clientTemplate = { 
            name: "45d35f93-1514-411d-8051-0efd2b9aeca4" ,
            variables: {
                name: bookData.client_name,
                destination: bookData.trips.name,
                date: bookData.day,
                persons: bookData.persons,
                price: bookData.total_price,
                deposit: bookData.deposite_price,
                host_name: bookData.Group.name,
                host_phone: bookData.Group.clients_contact_phone,
                booking_link: `${process.env.NEXT_PUBLIC_SITE_URL}/booking?paymentId=${bookData.deposits.payment_id}` 
            }
        };

        const hostTemplate = { 
            name: "2a8c6d39-7605-4b77-a950-c893279b5665", 
            variables: {
                trip_name: bookData.trips.name,
                date: bookData.day,
                persons: bookData.persons,
                price: bookData.total_price,
                deposit: bookData.deposite_price,
                client_name: bookData.client_name,
                client_phone: bookData.client_phone
            }
        };

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