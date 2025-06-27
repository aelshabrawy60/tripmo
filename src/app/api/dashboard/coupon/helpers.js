import { supabaseAdmin } from "@/utils/supabase/service";

export async function activateCoupon(couponCode, groupId) {
  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .eq("code", couponCode)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    console.log(error)
    console.log(data)
    return { status: "wrong", error };
  }

  const durationDays = data.duration || 0;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);

  const { error: updateError } = await supabaseAdmin
    .from("coupons")
    .update({
      status: "used",
      end_date: endDate.toISOString(),
      group_id: groupId
    })
    .eq("id", data.id);

  if (updateError) {
    return { status: "error", error: updateError };
  }

  return { status: "success", coupon: data };
}


export async function getCoupounStatus(groupId) {
    const {data, error} = await supabaseAdmin
        .from("coupons")
        .select("amount, end_date")
        .eq("status" , "used")
        .eq("group_id", groupId)
        .gte("end_date", new Date().toISOString())

    
    if(error){
        console.log(error)
        return null
    }

    if(data.length >= 1){
        return {
            amount: data[0].amount,
            end_date: data[0].end_date
        }
    }

    return null
} 