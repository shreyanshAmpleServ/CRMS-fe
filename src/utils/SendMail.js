import moment from "moment";

const SendEmail = async (data) => {
  console.log("Sending Data : ",data)
  const responseData = {
    smtp: {
      server: "smtp-relay.sendinblue.com",
      email: "ali.shariff@doubleclick.co.tz",
      password: "0UZ5FjMKq2RvmdEh",
    },
    from: `${data?.created_by_user?.email || "tshreyansh36@gmail.com"}`,
    to: [`${data?.assigned_to_user?.email || "shreyansh.tripathi@ampleserv.com"}`],
    subject: "📞 New Call Assignment",
    text: `Hello ${data.assigned_to_user?.full_name},

    You have been assigned a new call.
    
    Call Details:
    Date: ${moment(data.call_start_date).format("ll")}
    Time: ${moment(data.call_start_time).format("HH:mm A")}
    Created By: ${data.created_by_user.full_name}
    
    Best Regards,
    Your Team`,
    // text: `Hello ${data?.assigned_to_user?.full_name},\n\nYou have been assigned a new call.\n\nCall Details:\nDate: ${moment(data?.call_start_date).format("LL")}\nCreated By: ${data?.created_by_user?.name}\n\nBest Regards,\nDCC CRM Team`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
        <h2 style="color: #007bff;">📅 New Call Assignment</h2>
        <p>Hello <strong>${data.assigned_to_user?.full_name}</strong>,</p>
        <p>You have been assigned a new call. Below are the details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📆 Date:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${moment(data.call_start_date).format("ll")}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>⏰ Time:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${moment(data.call_start_time).format("HH:mm A")}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📞 Call For:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.call_for}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>👤 Call To:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.call_for === "Account" ? data.crms_m_contact_call_for?.firstName + data.crms_m_contact_call_for?.lastName : data.call_for === "Leads" ? data.crms_leads?.first_name + data.crms_leads?.last_name  : data.crms_project?.name}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📲 Call Purpose:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.crms_m_callpurposes?.name}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>👤 Created By:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.created_by_user?.full_name}</td>
            </tr>
        </table>
        <p>Best Regards,<br><strong>DCC CRM Team</strong></p>
    </div>
    `

    //  `<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;'>\
    //                     <h2 style='color: #007bff;'>📅 New Call Assignment</h2>\
    //                     <p>Hello <strong>USER_NAME</strong>,</p>\
    //                     <p>You have been assigned a new call. Below are the details:</p>\
    //                     <table style='width: 100%; border-collapse: collapse;'>\
    //                       <tr>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>📆 Date:</strong></td>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'>CALL_DATE</td>\
    //                       </tr>\
    //                       <tr>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>⏰ Time:</strong></td>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'>CALL_TIME</td>\
    //                       </tr>\
    //                       <tr>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>📞 Call For:</strong></td>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'>CALL_FOR</td>\
    //                       </tr>\
    //                       <tr>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>👤 Call To:</strong></td>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'>CALL_TO</td>\
    //                       </tr>\
    //                       <tr>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>📲 Call Purpose:</strong></td>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'>CALL_PURPOSE</td>\
    //                       </tr>\
    //                       <tr>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>👤 Created By:</strong></td>\
    //                         <td style='padding: 8px; border-bottom: 1px solid #ddd;'>CREATED_BY</td>\
    //                       </tr>\
    //                     </table>\
    //                     <p>Best Regards,<br><strong>DCC CRM Team</strong></p>\
    //                   </div>`
  };
  const token =
  "EAAWOFw8QuSgBOZB6IYFbdSTpTBWD9pXeI5DEZB8ZCs8Ivtg7Fopi9llcc5hddMgUx65IiLe7cZCJevlWMV7JVkTbwm8qG7FMDh3PMoiGabhuufRtgRV32gy0Ttw0XeZAJcBj48gEywbPrQ3K6wxL0ZBabBfsVhGBcqVTxGWHJ1UZBUXPkKoMiJ1QbIHnBAu0pL1";

  fetch("https://microservices.dcctz.com/api/send_email", {
    method: "POST",
    // mode: "no-cors", // Prevents CORS errors
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(responseData),
  })
    .then((response) => console.log("Email Sent", response))
    .catch((error) => console.error("Failed1 to send email", error));

    
// try {
//     const response = await fetch("https://microservices.dcctz.com/api/send_email", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`, // ✅ Correct token usage
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify(responseData),
//     });

//     if (!response.ok) {
//       const errorResponse = await response.json(); // Get error details
//       throw new Error(`Error ${response.status}: ${errorResponse.message}`);
//     }

//     console.log("✅ Email Sent Successfully!");
//   } catch (error) {
//     console.error("❌ Failed to send email:", error);
//   }
};
export default SendEmail;
