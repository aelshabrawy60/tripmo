import { supabaseAdmin } from "../supabase/service";
import { calculateAvalBalance, resetBalance } from "@/app/api/dashboard/balance/helper";
import {initPayout} from "@/utils/payments/payments"

async function addWithdrawRecord(groupId, withdraw_method_id, amount, status, transferId) {
    const {data, error} = await supabaseAdmin
        .from("withdraws")
        .insert([{"group_id": groupId, withdraw_method_id, amount, status, transfer_id: transferId}])
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

    try{
        // Generate a unique merchant transfer ID (you can use UUID or timestamp)
        const merchantTransferId = `withdraw_${groupId}_${Date.now()}`
        
        const payoutData = {
            amount: balance,
            method: withdrawMethod.methode,
            recipientName: 'John Doe',
            merchantTransferId: merchantTransferId,
            recipientBank: withdrawMethod.bank,
            recipientNumber: withdrawMethod.number,
            webhookUrl: 'https://tripmo.vercel.app/api/webhook/withdraws'
        }
        
        // Try payout first
        const payout = await initPayout(payoutData)
        
        // Only create record if payout succeeds
        const record = await addWithdrawRecord(groupId, withdraw_method_id, balance, "pending", payout.data[0]?.transferId)
        
        // Reset balance only after successful payout and record creation
        const r = await resetBalance(groupId)
        return r
        
    }catch(error){
        console.error('Error during payout:', error.message);
        // No record created, balance not reset
        throw error;
    }
}