export async function sendVerificationSMS(
  phone: string,
  code: string
): Promise<void> {
  const SMS_USERNAME = process.env.SMS_USERNAME;
  const SMS_PASSWORD = process.env.SMS_PASSWORD;
  try {
    const url = "https://webone-sms.ir/SMSInOutBox/Send";
    const data = {
      UserName: SMS_USERNAME,
      Password: SMS_PASSWORD,
      From: "10002147",
      To: phone,
      Message: `کد تایید شما ${code} جابزی`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send SMS");
    }
  } catch (error) {
    console.error("Error sending text:", error);
    throw new Error("Error sending verification code to the phone");
  }
}
