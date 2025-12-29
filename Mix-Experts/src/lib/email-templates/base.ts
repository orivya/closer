export interface EmailTemplateProps {
  previewText?: string;
  heading: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  footerText?: string;
}

export function getEmailTemplate({
  previewText = '',
  heading,
  body,
  ctaText,
  ctaUrl,
  footerText = 'MixExperts - Premium Audio Engineering Platform',
}: EmailTemplateProps): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mixexperts.com';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>${heading}</title>
      <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
        body { background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #C9956C 0%, #A67B5B 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 28px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -0.5px; }
        .content { background-color: #18181b; padding: 40px 32px; }
        .heading { color: #C9956C; font-size: 24px; font-weight: 700; margin: 0 0 24px 0; }
        .body-text { color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 0 0 16px 0; }
        .body-text p { margin: 0 0 16px 0; }
        .body-text ul { margin: 16px 0; padding-left: 20px; }
        .body-text li { margin-bottom: 8px; }
        .body-text a { color: #C9956C; text-decoration: underline; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #C9956C 0%, #A67B5B 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
        .footer { background-color: #0a0a0a; padding: 32px 20px; text-align: center; }
        .footer-text { color: #52525b; font-size: 14px; line-height: 20px; margin: 0 0 8px 0; }
        .footer-link { color: #71717a; text-decoration: underline; }
        .divider { height: 1px; background-color: #27272a; margin: 24px 0; }
        @media (prefers-color-scheme: dark) {
          body { background-color: #0a0a0a; }
          .content { background-color: #18181b; }
          .footer { background-color: #0a0a0a; }
        }
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .content { padding: 24px 16px !important; }
          .heading { font-size: 20px !important; }
          .body-text { font-size: 14px !important; }
        }
      </style>
    </head>
    <body>
      ${previewText ? `<span style="display: none; font-size: 1px; color: #0a0a0a; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${previewText}</span>` : ''}

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <div class="container">
              <div class="header">
                <h1 class="logo">MixExperts</h1>
              </div>

              <div class="content">
                <h2 class="heading">${heading}</h2>
                <div class="body-text">
                  ${body}
                </div>
                ${ctaText && ctaUrl ? `<a href="${ctaUrl}" class="cta-button">${ctaText}</a>` : ''}
              </div>

              <div class="footer">
                <p class="footer-text">${footerText}</p>
                <p class="footer-text">
                  <a href="${siteUrl}/dashboard/settings" class="footer-link">Email Preferences</a>
                </p>
                <p class="footer-text" style="margin-top: 16px;">
                  &copy; ${new Date().getFullYear()} MixExperts. All rights reserved.
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
