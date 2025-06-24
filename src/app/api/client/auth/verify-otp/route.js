// verify the OTP and if its verified then check if this phone has account if not create one for it
import { NextResponse } from "next/server";
import { isUserExists , createClient, getClientTokenByPhone} from "@/utils/client_auth/client_auth";
import verifyService from "@/lib/messagebird";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, otp, verificationId } = body;

    // Validate required fields
    if (!phone || !otp) {
      return NextResponse.json({ 
        success: false, 
        message: 'OTP ورمز التحقق والهاتف مطلوبان' 
      }, { status: 400 });
    }

    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({
        success: false,
        message: 'رمز التحقق يجب أن يكون 6 أرقام'
      }, { status: 400 });
    }

    const result = await verifyService.verifyCode(verificationId, otp);

    const verficationResult = result.success && result.verified

    if (verficationResult) {
      // check if the phone has an account
      const user = await isUserExists(phone)

      let UserToken = null
      let UserId = user?.id
      let UserPhone = user?.phone
      if(!user){
        const client = await createClient(phone)
        UserToken = client.token
        UserId = client.client.id
        UserPhone = client.client.phone
      }else{
        UserToken = await getClientTokenByPhone(phone)
      }

      return NextResponse.json({
        success: true,
        message: 'تم التحقق من الرمز بنجاح',
        clientName: user?.name,
        clientToken: UserToken,
        clientPhone: UserPhone,
        clientId: UserId
      });

    } else {
      console.error('OTP Verify Error:', result);
      
      const data = result
      // Handle specific error cases
      let errorMessage = 'رمز التحقق غير صحيح';
      
      if (data.message) {
        if (data.message.includes('expired')) {
          errorMessage = 'انتهت صلاحية رمز التحقق - اطلب رمز جديد';
        } else if (data.message.includes('invalid')) {
          errorMessage = 'رمز التحقق غير صحيح';
        } else if (data.message.includes('used')) {
          errorMessage = 'تم استخدام هذا الرمز بالفعل';
        } else {
          errorMessage = data.message;
        }
      }

      return NextResponse.json({
        success: false,
        message: errorMessage
      }, { status: 400 });
    }
  } catch (error) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطأ في الخادم - حاول مرة أخرى'
    }, { status: 500 });
  }
}