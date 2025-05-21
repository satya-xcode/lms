import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'satyaxcode@gmail.com',
    pass: 'kbnb plkn stia obco'
  }
});

interface SendLeaveRequestEmailParams {
  to: string;
  staffName: string;
  requestId: string;
  reason: string;
  startDate: string;
  endDate: string;
}

export async function sendLeaveRequestEmail({
  to,
  staffName,
  reason,
  startDate,
  endDate
}: SendLeaveRequestEmailParams) {
  // const approveLink = `https://lms-liard-two.vercel.app/api/leave/${requestId}/approve`;
  // const rejectLink = `https://lms-liard-two.vercel.app/api/leave/${requestId}/reject`;

  //   const localurl = 'http://localhost:3000/manager'
  //   const productionLink = 'https://lms-liard-two.vercel.app/manager'

  // const managerLink = process.env.NODE_ENV === 'development' ? '' :
  const managerLink = `${process.env.NEXTAUTH_URL}/manager`;


  await transporter.sendMail({
    from: 'leave-management@tianyinworldtech.com',
    to,
    subject: `Leave Request from ${staffName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Leave Request</h2>
        <p><strong>${staffName}</strong> has submitted a leave request:</p>
        <ul>
          <li><strong>Reason:</strong> ${reason}</li>
          <li><strong>Duration:</strong> ${startDate} to ${endDate}</li>
        </ul>
        <p>To review, approve, or reject this request, please open the leave management dashboard:</p>
        <a href="${managerLink}"
           style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin-top: 12px;">
           Open Manager Dashboard
        </a>
        <p style="margin-top: 16px; font-size: 14px; color: #555;">
          This action requires manager authentication.
        </p>
      </div>
    `
  });

}