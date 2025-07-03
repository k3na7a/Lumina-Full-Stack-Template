import * as sgMail from '@sendgrid/mail';

interface attachment {
  content: string;
  filename: string;
  type?: string;
  disposition?: string;
}

interface emailProps {
  to: string[];
  subject: string;
  html: string;
  attachments?: attachment[];
}

class SendGridPlugin {
  public static init(): void {
    sgMail.setApiKey(String(process.env.SENDGRID_API_KEY));
  }

  public static async sendMail(props: emailProps): Promise<void> {
    await sgMail.send({
      ...props,
      from: `${String(process.env.SENDGRID_VERIFIED_SENDER)} <${String(process.env.SENDGRID_VERIFIED_SENDER_EMAIL)}>`,
    });
  }
}

export { SendGridPlugin };
export type { attachment, emailProps };
