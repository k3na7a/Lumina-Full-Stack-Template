interface options {
  name: string;
  email: string;
  redirect: string;
}

const subject = 'Reset your password';
const template = `<p><span>Hello {{ name }},</span><br/><br/>
  <span>We've received a request to reset the password for the account associated with {{ email }}.</span><br/><br/>
  <span>You can reset your password by clicking the link below:</span><br/><br/>
  <a href="{{ redirect }}">{{ redirect }}</a><br/><br/>
  <span>This link will expire in 15 minutes.</span><br/><br/>
  <span><strong>What to do if you didn't request this email</strong></span><br/>
  <span>If you did not request a password reset you can safely disregard this email. Your password will not be changed.</span><br/><br/>
  <span>Kind regards,</span><br/>
  <span>John Desjardins</span></p>`;

export { subject, template };
export type { options };
