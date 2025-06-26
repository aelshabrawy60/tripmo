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

        console.log("book data", bookData)

        // Define both templates
        const clientTemplate = { 
            name: "c68824fb-6ea8-404c-bb38-f770f5eb2c56" ,
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

    async sendBookCancellation(channelName, bookId, canRefund){
        console.log("sending cancellation" );

        const bookData = await fetchBookData(bookId)
        const hostNumber = bookData.Group.notifications_number
        const to = bookData.clients.phone
        // Define both templates
        let clientTemplate = { };

        if(canRefund){
            clientTemplate = {
                name : "a41f8b47-e639-4149-8476-c13cbe6aeeb6",
                variables : {
                    name: bookData.client_name,
                    trip_name: bookData.trips.name,
                    date: bookData.day,
                    persons: bookData.persons,
                    total_price: bookData.total_price,
                    refund_amount: bookData.total_price
                }
            }
        }else{
            clientTemplate = {
                name: "a0796746-2048-4e6e-a2f3-79b32d3f1b07",
                variables: {
                    name: bookData.client_name,
                    trip_name: bookData.trips.name,
                    date: bookData.day,
                    persons: bookData.persons,
                }
            }
        }
        
        const hostTemplate = { 
            name: "b580a06f-0d70-46bd-aa8c-04f441b0851e",
            variables: {
                client_name: bookData.client_name,
                client_phone: bookData.client_phone,
                trip_name: bookData.trips.name,
                date: bookData.day,
                persons: bookData.persons,
                total_price: bookData.total_price,
                refund_amount: canRefund == true ? bookData.total_price : 0
            }
        };

        
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
        .select("*, Group(notifications_number), clients(phone), trips(name)")
        .eq('id', bookId)
        .single()

    if(error){
        console.log(error)
    }

    return data
}