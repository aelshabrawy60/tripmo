import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";


async function isBookRated(bookId) {
  const {data, error} = await supabaseAdmin.from("ratings").select('*').eq("book_id", bookId)

  if(error){
    console.log(error)
    return true
  }

  if(data.length > 0){
    return true
  }

  return false
} 


async function addRate(tripId, sender_name, value, comment, groupId, bookId) {
    const {data, error} = await supabaseAdmin.from('ratings').insert([{"trip_id": tripId, sender_name, value, comment, "group_id": groupId, "book_id": bookId}])

    if(error){
        console.log(error)
        return null
    }
    
    return data
}

export async function POST(request) {
    const { tripId, sender_name, value, comment, groupId, bookId } = await request.json();

    try {
        
        const isBookRated_ = isBookRated(bookId) 

        if(isBookRated_){
            return NextResponse.json({success: false, message: "تم تقييم هذه الرحلة من قبل"}, {status: 400})
        }
        const rate = await addRate(tripId, sender_name, value, comment, groupId, bookId)
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error in adding rate:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while adding rate." }, { status: 500 });
    }
}
