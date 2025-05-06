import { supabaseAdmin } from '@/utils/supabase/service';
import { fetchPaymentsOptions } from '@/utils/group/group';
import PaymentClient from '../../../components/client';

// Server component (no 'use client' directive)
export default async function PaymentPage({ params }) {
  // Access params directly in server component - this is safe in Next.js server components
  const paymentId = params.id;
  
  // Fetch payment data
  const paymentData = await fetchPaymentData(paymentId);
  if (!paymentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 w-16 h-16 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-500">خطأ في جلب بيانات الدفع</h1>
        <p className="text-gray-600 mt-2">لم نتمكن من العثور على معلومات الدفع المطلوبة</p>
      </div>
    );
  }
  
  // Fetch payment methods
  const groupId = paymentData.group_id;
  let paymentMethods = await fetchPaymentMethodes(groupId);
  
  paymentMethods = JSON.parse(paymentMethods)
  // Pass the data to the client component
  return <PaymentClient paymentData={paymentData} paymentMethods={paymentMethods} paymentId={paymentId} />;
}

// Helper functions
async function fetchPaymentData(id) {
  if (!id) return null;
  
  const { data, error } = await supabaseAdmin
    .from("deposits")
    .select("*")
    .eq("payment_id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

async function fetchPaymentMethodes(groupId) {
  const options = await fetchPaymentsOptions(groupId);
  return options?.deposit_methodes || [];
  // Example format: [{"name":"vodafone_cash","id":"01019689098","note":""}]
}