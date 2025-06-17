import { supabaseAdmin } from "../supabase/service";
import { calculateAvalBalance, resetBalance } from "@/app/api/dashboard/balance/helper";
import {initPayout} from "@/utils/payments/payments"

async function addWithdrawRecord(groupId, withdraw_method_id, amount, status) {
    const {data, error} = await supabaseAdmin
        .from("withdraws")
        .insert([{"group_id": groupId, withdraw_method_id, amount, status}])
        .select("*")
        .single()
    
    if(error){
        console.log(error)
        return null
    }

    return data
}


async function fetchWithdrawMethode(id) {
    const {data, error} = await supabaseAdmin.from("withdraw_methodes").select('*').eq("id", id).single()

    if(error){
        console.log(error)
        return null
    }

    return data
}

export async function withdraw(groupId, withdraw_method_id){
    // calculate balance 
    const balance = await calculateAvalBalance(groupId)

    if(balance < 50){
        return {"result": false, "message": "الحد الادني للسحب 50 ج.م"}
    }

    // fetch withdraw method
    const withdrawMethod = await fetchWithdrawMethode(withdraw_method_id)

    // add withdraw record
    const record = await addWithdrawRecord(groupId, withdraw_method_id, balance, "pending")

    //
    const r = await resetBalance(groupId)

    const payoutData = {
        amount: balance,
        method: withdrawMethod.methode,
        recipientName: 'John Doe',
        merchantTransferId: record.id,
        recipientBank: withdrawMethod.bank,
        recipientNumber: withdrawMethod.number,
        webhookUrl: 'https://tripmo.vercel.app/api/webhook/withdraws'
    }
    const payout = await initPayout(payoutData)

    return r
}