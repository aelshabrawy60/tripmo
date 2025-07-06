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
        throw error
    }

    return data
}


async function fetchWithdrawMethode(id) {
    const {data, error} = await supabaseAdmin.from("withdraw_methodes").select('*, Group(name)').eq("id", id).single()

    if(error){
        console.log(error)
        return null
    }

    return data
}

export async function withdraw(groupId, withdraw_method_id) {
    const type = "manual"
    //const type = "auto"

    // calculate balance 
    const balance = await calculateAvalBalance(groupId);

    if (balance < 9) {
        throw new Error("الحد الادني للسحب 50 ج.م");
    }

    // fetch withdraw method
    const withdrawMethod = await fetchWithdrawMethode(withdraw_method_id);

    try {
        // Generate a unique merchant transfer ID
        const merchantTransferId = `withdraw_${groupId}_${Date.now()}`;

        // Build base payout data
        const payoutData = {
            amount: balance,
            method: withdrawMethod.methode,
            recipientName: withdrawMethod.Group.name || 'John Doe',
            merchantTransferId: merchantTransferId,
            recipientNumber: withdrawMethod.number,
        };

        // Add recipientBank only if method is not "wallet" or "instant wallet"
        const method = withdrawMethod.methode?.toLowerCase();
        if (method !== "wallet" && method !== "instant wallet") {
            payoutData.recipientBank = withdrawMethod.bank;
        }

        console.log("payload", payoutData);

        if(type == "auto"){

            const payout = await initPayout(payoutData);
            const record = await addWithdrawRecord(groupId, withdraw_method_id, balance, "pending", payout.data[0]?.transferId);

        }else{
            const record = await addWithdrawRecord(groupId, withdraw_method_id, balance, "pending", "manual");
        }

        // Reset balance only after successful payout and record creation
        const r = await resetBalance(groupId);
        return r;

    } catch (error) {
        console.error('Error during payout:', error.message);
        throw error;
    }
}



export async function confirmWithdraw(withdraw_id) {
    const {data, error} = await supabaseAdmin.from("withdraws")
        .update({status: "TRANSFERRED"})
        .eq("id", withdraw_id)
    
    if(error){
        console.log(error)
        throw error
    }

    return data
}