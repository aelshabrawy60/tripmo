import { calculateAffiliateAvalBalance, calculateAffiliateTotalBalance } from "@/app/api/affiliate/balance/helper";
import { supabaseAdmin } from "../supabase/service";

async function fetchAffiliateWithdrawMethode(id) {
    const {data, error} = await supabaseAdmin.from("withdraw_methodes").select('*, affiliates(name)').eq("id", id).single()

    if(error){
        console.log(error)
        return null
    }

    return data
}

import { v4 as uuidv4 } from 'uuid';


export async function AffiliateWithdraw(affiliateId, withdraw_method_id, affiliateRef) {
  const type = "auto"; // or "auto"
  const currentDate = new Date().toISOString();

  // Step 1: Calculate balances
  const [total_balance, balance] = await Promise.all([
    calculateAffiliateTotalBalance(affiliateRef),
    calculateAffiliateAvalBalance(affiliateRef, currentDate)
  ]);

  if (balance < 5) {
    throw new Error("الحد الادني للسحب 50 ج.م");
  }

  // Step 2: Fetch withdraw method
  const withdrawMethod = await fetchAffiliateWithdrawMethode(withdraw_method_id);

  // Step 3: Prepare data
  const outbox_id = uuidv4();
  const merchantTransferId = outbox_id

  const payoutData = {
    amount: balance,
    method: withdrawMethod.methode,
    recipientName: withdrawMethod.affiliates.name || 'John Doe',
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
  const { error } = await supabaseAdmin.rpc("affiliate_withdraw", {
    affiliate_id: affiliateId,
    referral_code: affiliateRef,
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
