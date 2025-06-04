interface options {
  name: string;
  email: string;
  redirect: string;
}

const subject = 'Reset your password';
const template = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 2rem 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; padding: 2rem; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <tr>
            <td align="left">
              <h2 style="margin-top: 0;">Hello {{ name }},</h2>
              <p style="line-height: 1.6;">
                We received a request to reset the password for your account associated with <strong>{{ email }}</strong>.
              </p>
              <p style="line-height: 1.6;">
                Click the button below to reset your password. This link will expire in 15 minutes.
              </p>
              <p style="text-align: center; margin: 2rem 0;">
                <a href="{{ redirect }}" style="background-color: #4f46e5; color: #ffffff; padding: 0.75rem 1.5rem; border-radius: 4px; text-decoration: none; font-weight: bold;">
                  Reset Password
                </a>
              </p>
              <p style="line-height: 1.6;">
                If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
              <p style="margin-top: 2rem;">
                Kind regards,<br/>
                <strong>John Desjardins</strong>
              </p>
            </td>
          </tr>
        </table>
        <p style="font-size: 0.85rem; color: #999999; margin-top: 1rem;">
          If you're having trouble clicking the button, copy and paste the following URL into your browser:<br/>
          <a href="{{ redirect }}" style="color: #4f46e5;">{{ redirect }}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

export { subject, template };
export type { options };
