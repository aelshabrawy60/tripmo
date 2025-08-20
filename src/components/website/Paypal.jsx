import React, { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


// Renders errors or successfull transactions on the screen.
function Message({ content }) {
    return <p>{content}</p>;
}


function Paypal({OrderPayload}) {

    const [message, setMessage] = useState("");

    const initialOptions = {
        "client-id":
            "AVlPPp8tVH66bgP064QAptT__9PQKbNMAMYjyfvpEtroWZIxJfVtlvmh9g3rBB-8t03F6r2VatOaIl9p",
        "buyer-country": "EG",
        currency: "USD",
    };
  return (
    <div>
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                style={{
                    shape: "rect",
                    layout: "vertical",
                    color: "gold",
                    label: "paypal",
                }}
                createOrder={async () => {
                    try {
                        console.log("Creating PayPal order...", OrderPayload);

                        const response = await fetch('/api/client/bookings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(OrderPayload),
                        });


                        const data = await response.json();

                        if (data.paymentId) {
                            return data.paymentId;
                        } else {
                            const errorMessage = data?.message || "Unknown error occurred";
                            throw new Error(errorMessage);
                        }
                    } catch (error) {
                        console.error(error);
                        setMessage(
                            `Could not initiate PayPal Checkout...${error}`
                        );
                    }
                }}
                onApprove={async (data, actions) => {
                    try {
                        const response = await fetch(
                            `/api/client/payments/capture`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ orderID: data.orderID }),
                            }
                        );

                        const orderData = await response.json();

                        console.log("Order data:", orderData);
                        // Three cases to handle:
                        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                        //   (2) Other non-recoverable errors -> Show a failure message
                        //   (3) Successful transaction -> Show confirmation or thank you message

                        const errorDetail = orderData?.details?.[0];

                        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                            return actions.restart();
                        } else if (errorDetail) {
                            // (2) Other non-recoverable errors -> Show a failure message
                            throw new Error(
                                `${errorDetail.description} (${orderData.debug_id})`
                            );
                        } else {
                            // (3) Successful transaction -> Show confirmation or thank you message
                            // Or go to another URL:  actions.redirect('thank_you.html');
                            const transaction =
                                orderData.purchase_units[0].payments
                                    .captures[0];
                            setMessage(
                                `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                            );
                            console.log(
                                "Capture result",
                                orderData,
                                JSON.stringify(orderData, null, 2)
                            );
                            actions.redirect(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/booking?paymentId=${transaction.id}`);
                        }
                    } catch (error) {
                        console.error(error);
                        setMessage(
                            `Sorry, your transaction could not be processed...${error}`
                        );
                    }
                }}
            />
        </PayPalScriptProvider>
        <Message content={message} />
    </div>
  )
}

export default Paypal