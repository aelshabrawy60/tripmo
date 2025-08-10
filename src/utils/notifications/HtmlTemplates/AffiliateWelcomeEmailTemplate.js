

export function getAffiliateWelcomeHtmlTemplate(affiliateData){
    return `
    <!doctype html>
    <html lang="ar" dir="rtl">
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>أهلاً بك في برنامج شركاء رحلة ناو</title>
    <style>
        /* قواعد بسيطة ومضمنة مناسبة للإيميلات */
        body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: "Segoe UI", Tahoma, Arial, "Helvetica Neue", sans-serif;
        color: #222;
        -webkit-text-size-adjust: 100%;
        }
        .container {
        width: 100%;
        max-width: 600px;
        margin: 24px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
        }
        .header {
        background: linear-gradient(90deg,#0ea5a4,#0369a1);
        color: #fff;
        padding: 20px;
        text-align: center;
        }
        .header h1 {
        margin: 0;
        font-size: 20px;
        }
        .content {
        padding: 20px;
        line-height: 1.6;
        }
        .greeting {
        font-size: 16px;
        margin-bottom: 12px;
        }
        .details {
        background: #f8fafc;
        border: 1px solid #eef2f7;
        padding: 12px;
        border-radius: 6px;
        margin: 12px 0;
        word-break: break-all;
        }
        .detail-row {
        margin: 6px 0;
        font-size: 14px;
        }
        .btn {
        display: inline-block;
        text-decoration: none;
        padding: 10px 18px;
        border-radius: 8px;
        background: #0ea5a4;
        color: #ffffff;
        font-weight: 600;
        margin-top: 14px;
        }
        .footer {
        padding: 16px 20px;
        font-size: 13px;
        color: #6b7280;
        text-align: center;
        border-top: 1px solid #f1f5f9;
        }
        @media (max-width: 420px) {
        .container { margin: 12px; }
        .header h1 { font-size: 18px; }
        }
    </style>
    </head>
    <body>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:20px 0;">
        <tr>
        <td align="center">
            <table class="container" role="presentation" cellpadding="0" cellspacing="0">
            <tr>
                <td class="header">
                <h1>🎉 أهلاً بك في برنامج شركاء <span style="font-weight:700">رحلة ناو</span>!</h1>
                </td>
            </tr>

            <tr>
                <td class="content">
                <p class="greeting">مرحباً <strong>${affiliateData.name}</strong>،</p>

                <p>يسعدنا انضمامك إلى <strong>برنامج شركاء رحلة ناو</strong> 🚀<br>
                لقد تم إنشاء حسابك بنجاح ويمكنك الآن البدء في كسب العمولات من كل عملية حجز تتم عن طريقك.</p>

                <div class="details" aria-label="بيانات الحساب">
                    <div class="detail-row"><strong>البريد الإلكتروني:</strong> ${affiliateData.email}</div>
                    <div class="detail-row"><strong>كلمة المرور:</strong> ${affiliateData.password}</div>
                </div>

                <p>يمكنك تسجيل الدخول إلى لوحة التحكم لمتابعة الإحالات والعمولات وإحصاءات الأداء:</p>

                <p>
                    <a class="btn" href="https://affiliate.rehlanow.com" target="_blank" rel="noopener noreferrer">تسجيل الدخول إلى لوحة الشركاء</a>
                </p>

                <h4 style="margin-top:18px; margin-bottom:8px;">ماذا بعد؟</h4>
                <ul style="padding-right: 18px; margin: 0 0 12px 0;">
                    <li>شارك رابط الإحالة الخاص بك مع جمهورك.</li>
                    <li>اربح عمولة عن كل حجز ناجح يتم من خلال رابطك.</li>
                    <li>راصد أداءك وعمولاتك من لوحة التحكم بانتظام.</li>
                </ul>

                <p>إن كان لديك أي استفسار أو تحتاج مساعدة، يمكنك الرد على هذا البريد وسنكون سعداء بمساعدتك.</p>

                <p style="margin-top:18px;">مع أطيب التحيات،<br><strong>فريق رحلة ناو</strong></p>
                </td>
            </tr>
            </table>
        </td>
        </tr>
    </table>

    <script>
        // لتحديث السنة تلقائياً (السكريبت بسيط، يعمل فقط داخل بعض عملاء البريد التي تسمح بالـ JS — آمن تركه)
        try {
        document.getElementById('year').textContent = new Date().getFullYear();
        } catch (e) { /* ignore */ }
    </script>
    </body>
    </html>
    `
}