import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
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
    requestId,
    reason,
    startDate,
    endDate
}: SendLeaveRequestEmailParams) {
    const approveLink = `${process.env.NEXTAUTH_URL}/api/leave/${requestId}/approve`;
    const rejectLink = `${process.env.NEXTAUTH_URL}/api/leave/${requestId}/reject`;

    await transporter.sendMail({
        from: 'leave-management@tianyinworldtech.com',
        to,
        subject: `Leave Request from ${staffName}`,
        html: `
      <div>
        <h2>Leave Request Notification</h2>
        <p>You have received a leave request from ${staffName}:</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Duration:</strong> ${startDate} to ${endDate}</p>
        <div style="margin-top: 20px;">
          <a href="${approveLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; margin-right: 10px;">Approve</a>
          <a href="${rejectLink}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none;">Reject</a>
        </div>
      </div>
    `
    });
}