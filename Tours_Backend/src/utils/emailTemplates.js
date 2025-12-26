export const deletionRequestTemplate = (guideName, reason) => ({
    subject: 'Account Deletion Request - Action Required',
    html: `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #d33;">Account Deletion Request</h2>
      <p>A guide has requested to delete their account.</p>
      <hr />
      <p><strong>Guide Name:</strong> ${guideName}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please log in to the admin dashboard to review and action this request.</p>
      <a href="${process.env.ADMIN_DASHBOARD_URL}/all-guides" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
    </div>
  `
});

export const deletionApprovedTemplate = (guideName) => ({
    subject: 'Your Account Deletion Request - Approved',
    html: `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #28a745;">Account Deletion Approved</h2>
      <p>Hi ${guideName},</p>
      <p>Your request to delete your account has been approved. Your data has been removed from our system.</p>
      <p>We are sorry to see you go!</p>
    </div>
  `
});

export const deletionRejectedTemplate = (guideName, reason) => ({
    subject: 'Your Account Deletion Request - Update',
    html: `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #ffc107;">Account Deletion Request Update</h2>
      <p>Hi ${guideName},</p>
      <p>Your request to delete your account has been reviewed and rejected for the following reason:</p>
      <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
        ${reason}
      </blockquote>
      <p>If you have any questions, please contact support.</p>
    </div>
  `
});
