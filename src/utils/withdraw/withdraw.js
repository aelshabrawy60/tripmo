import { supabaseAdmin } from "../supabase/service";
import { calculateAvalBalance, calculateTotalBalance, resetBalance } from "@/app/api/dashboard/balance/helper";
import {initPayout} from "@/utils/payments/payments"

async function addWithdrawRecord(groupId, withdraw_method_id, amount, status, transferId, balance_before_withdraw) {
    const {data, error} = await supabaseAdmin
        .from("withdraws")
        .insert([{"group_id": groupId, withdraw_method_id, amount, status, transfer_id: transferId, balance_before_withdraw}])
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

import { v4 as uuidv4 } from 'uuid';


export async function withdraw(groupId, withdraw_method_id) {
  const type = "auto"; // or "auto"
  const currentDate = new Date().toISOString();

  // Step 1: Calculate balances
  const [total_balance, balance] = await Promise.all([
    calculateTotalBalance(groupId),
    calculateAvalBalance(groupId, currentDate)
  ]);

  if (balance < 5) {
    throw new Error("الحد الادني للسحب 50 ج.م");
  }

  // Step 2: Fetch withdraw method
  const withdrawMethod = await fetchWithdrawMethode(withdraw_method_id);

  // Step 3: Prepare data
  const outbox_id = uuidv4();
  const merchantTransferId = outbox_id

  const payoutData = {
    amount: balance,
    method: withdrawMethod.methode,
    recipientName: withdrawMethod.Group.name || 'John Doe',
    merchantTransferId,
    recipientNumber: withdrawMethod.number,
  };

  const method = withdrawMethod.methode?.toLowerCase();
  if (method !== "wallet" && method !== "instant wallet") {
    payoutData.recipientBank = withdrawMethod.bank;
  }

  const isManual = type === "manual";
  const transferId = isManual ? "manual" : "pending";

  // Step 4: Call the Supabase RPC function (atomic DB transaction)
  const { error } = await supabaseAdmin.rpc("host_withdraw", {
    group_id: groupId,
    method_id: withdraw_method_id,
    amount: balance,
    total_balance,
    transfer_id: transferId,
    outbox_id,
    payload: isManual ? {} : payoutData,
    current_date_input: currentDate,
    manual: isManual,
  });

  if (error) {
    console.error("Withdrawal failed:", error);
    throw new Error("فشل تنفيذ السحب");
  }

  return {
    message: isManual ? "تم تسجيل السحب كيدوي" : "تم استلام طلب السحب",
    status: "pending",
  };
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