import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "Honest-Maison <noreply@maison.k-honest.com>";
const ADMIN_EMAIL = "info@maison.k-honest.com";

function getResend() {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Emails will not be sent.");
    return null;
  }
  return resend;
}

// 会員登録完了メール
export async function sendWelcomeEmail(to: string, name: string) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "【Honest-Maison】会員登録ありがとうございます",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>${name} 様</p>
          <p>この度は、Honest-Maisonに会員登録いただき、誠にありがとうございます。</p>
          <p>
            厳選されたブランド品・高級時計を取り揃えております。<br />
            ぜひごゆっくりお買い物をお楽しみください。
          </p>
          <div style="margin: 30px 0;">
            <a href="https://honest-ec.vercel.app/products"
               style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">
              商品を見る
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Welcome email error:", error);
    return { success: false, error };
  }
}

// 問い合わせ受付メール（顧客向け）
export async function sendContactConfirmEmail(
  to: string,
  name: string,
  subject: string,
  message: string
) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "【Honest-Maison】お問い合わせを受け付けました",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>${name} 様</p>
          <p>お問い合わせいただきありがとうございます。</p>
          <p>以下の内容でお問い合わせを受け付けました。<br />
          担当者より2〜3営業日以内にご連絡いたします。</p>

          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>件名:</strong><br />${subject}</p>
            <p style="margin: 0;"><strong>お問い合わせ内容:</strong><br />${message.replace(/\n/g, "<br />")}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Contact confirm email error:", error);
    return { success: false, error };
  }
}

// 問い合わせ通知メール（管理者向け）
export async function sendContactNotifyEmail(
  customerName: string,
  customerEmail: string,
  subject: string,
  message: string
) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `【問い合わせ】${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">新しいお問い合わせ</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="text-align: left; padding: 8px; background: #f5f5f5; border: 1px solid #ddd;">お名前</th>
              <td style="padding: 8px; border: 1px solid #ddd;">${customerName}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; background: #f5f5f5; border: 1px solid #ddd;">メール</th>
              <td style="padding: 8px; border: 1px solid #ddd;">${customerEmail}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; background: #f5f5f5; border: 1px solid #ddd;">件名</th>
              <td style="padding: 8px; border: 1px solid #ddd;">${subject}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; background: #f5f5f5; border: 1px solid #ddd;">内容</th>
              <td style="padding: 8px; border: 1px solid #ddd;">${message.replace(/\n/g, "<br />")}</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <a href="https://honest-ec.vercel.app/admin/inquiries"
               style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">
              管理画面で確認
            </a>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Contact notify email error:", error);
    return { success: false, error };
  }
}

// パスワードリセットメール
export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  const resetUrl = `https://honest-ec.vercel.app/reset-password?token=${resetToken}`;

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "【Honest-Maison】パスワード再設定のご案内",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>${name} 様</p>
          <p>パスワード再設定のリクエストを受け付けました。</p>
          <p>下記のボタンをクリックして、新しいパスワードを設定してください。</p>

          <div style="margin: 30px 0;">
            <a href="${resetUrl}"
               style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">
              パスワードを再設定する
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            ※このリンクは24時間有効です。<br />
            ※心当たりのない場合は、このメールを無視してください。
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Password reset email error:", error);
    return { success: false, error };
  }
}

// パスワード変更完了メール
export async function sendPasswordChangedEmail(to: string, name: string) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "【Honest-Maison】パスワードが変更されました",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>${name} 様</p>
          <p>パスワードが正常に変更されました。</p>
          <p>
            心当たりのない場合は、お早めに下記までお問い合わせください。
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Password changed email error:", error);
    return { success: false, error };
  }
}

// 注文完了メール
export async function sendOrderConfirmEmail(
  to: string,
  name: string,
  orderId: string,
  items: { name: string; price: number }[],
  total: number,
  paymentMethod: "credit_card" | "bank_transfer"
) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">¥${item.price.toLocaleString()}</td>
        </tr>`
    )
    .join("");

  const bankInfo =
    paymentMethod === "bank_transfer"
      ? `
        <div style="background: #fef3c7; padding: 20px; margin: 20px 0; border-left: 4px solid #0891b2;">
          <h3 style="margin: 0 0 10px 0;">お振込先</h3>
          <p style="margin: 0; font-size: 14px;">
            住信SBIネット銀行 法人第一支店（106）<br />
            普通 2571301<br />
            口座名義: ド）オネスト<br /><br />
            ※7日以内にお振込みください。<br />
            ※振込手数料はお客様負担となります。
          </p>
        </div>
      `
      : "";

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "【Honest-Maison】ご注文ありがとうございます",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>${name} 様</p>
          <p>この度はご注文いただき、誠にありがとうございます。</p>
          <p>ご注文番号: <strong>${orderId}</strong></p>

          ${bankInfo}

          <h3>ご注文内容</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding: 12px 8px; font-weight: bold;">合計（税込）</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold;">¥${total.toLocaleString()}</td>
            </tr>
          </table>

          <div style="margin: 30px 0;">
            <a href="https://honest-ec.vercel.app/mypage/orders"
               style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">
              注文履歴を確認
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Order confirm email error:", error);
    return { success: false, error };
  }
}

// 注文ステータス変更メール
export async function sendOrderStatusEmail(
  to: string,
  name: string,
  orderNumber: string,
  status: string,
  trackingNumber?: string
) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  const statusMessages: Record<string, { subject: string; message: string }> = {
    PAYMENT_CONFIRMED: {
      subject: "【Honest-Maison】ご入金を確認しました",
      message: `
        <p>ご入金を確認いたしました。ありがとうございます。</p>
        <p>商品の検品・梱包を行い、準備が整い次第発送いたします。</p>
      `,
    },
    SHIPPED: {
      subject: "【Honest-Maison】商品を発送しました",
      message: `
        <p>ご注文の商品を発送いたしました。</p>
        ${trackingNumber ? `<p><strong>追跡番号: ${trackingNumber}</strong></p>` : ""}
        <p>お届けまで今しばらくお待ちください。</p>
        <div style="margin: 20px 0;">
          <a href="https://www.kuronekoyamato.co.jp/ytc/ja/support/inquiry/"
             style="color: #0891b2; text-decoration: underline;">
            ヤマト運輸で配送状況を確認する
          </a>
        </div>
      `,
    },
    DELIVERED: {
      subject: "【Honest-Maison】商品をお届けしました",
      message: `
        <p>商品のお届けが完了いたしました。</p>
        <p>この度はHonest-Maisonをご利用いただき、誠にありがとうございます。</p>
        <p>商品にご不明点やお気づきの点がございましたら、お気軽にお問い合わせください。</p>
      `,
    },
    CANCELLED: {
      subject: "【Honest-Maison】ご注文をキャンセルしました",
      message: `
        <p>ご注文をキャンセルいたしました。</p>
        <p>ご不明点がございましたら、お問い合わせください。</p>
      `,
    },
  };

  const statusInfo = statusMessages[status];
  if (!statusInfo) {
    return { success: false, error: "Unknown status" };
  }

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: statusInfo.subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>${name} 様</p>
          <p>ご注文番号: <strong>${orderNumber}</strong></p>

          ${statusInfo.message}

          <div style="margin: 30px 0;">
            <a href="https://honest-ec.vercel.app/mypage/orders"
               style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">
              注文履歴を確認
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Order status email error:", error);
    return { success: false, error };
  }
}

// 再入荷通知メール
export async function sendRestockNotificationEmail(
  to: string,
  productName: string,
  productId: string
) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `【Honest-Maison】${productName}が再入荷しました`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>お知らせをご登録いただいた商品が再入荷しました。</p>

          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0; font-size: 18px;">${productName}</h2>
          </div>

          <p>人気商品のため、お早めにご検討ください。</p>

          <div style="margin: 30px 0;">
            <a href="https://maison.k-honest.com/products/${productId}"
               style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">
              商品を見る
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Restock notification email error:", error);
    return { success: false, error };
  }
}

// 新着入荷通知メール
export async function sendNewArrivalEmail(
  to: string,
  customerName: string,
  productName: string,
  productId: string,
  brandName: string,
  price: number
) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `【Honest-Maison】新商品入荷のお知らせ`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>${customerName} 様</p>
          <p>新しい商品が入荷しました。</p>

          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${brandName}</p>
            <h2 style="margin: 0 0 10px 0; font-size: 18px;">${productName}</h2>
            <p style="margin: 0; font-size: 20px; font-weight: bold;">¥${price.toLocaleString()}</p>
          </div>

          <div style="margin: 30px 0;">
            <a href="https://maison.k-honest.com/products/${productId}"
               style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block;">
              商品を見る
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
          <p style="font-size: 11px; color: #999;">
            ※このメールは会員の皆様にお送りしています。<br />
            配信停止をご希望の場合はマイページの設定よりお手続きください。
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("New arrival email error:", error);
    return { success: false, error };
  }
}

// 問い合わせ返信メール
export async function sendInquiryReplyEmail(
  to: string,
  name: string,
  reply: string
) {
  const client = getResend();
  if (!client) return { success: false, error: "Email service not configured" };

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "【Honest-Maison】お問い合わせへのご回答",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            Honest-Maison
          </h1>
          <p>${name} 様</p>
          <p>お問い合わせいただきありがとうございます。</p>
          <p>以下の通りご回答いたします。</p>

          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #0891b2;">
            ${reply.replace(/\n/g, "<br />")}
          </div>

          <p>ご不明点がございましたら、お気軽にお問い合わせください。</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">
            合同会社Honest<br />
            〒169-0072 東京都新宿区大久保2-19-15 サンフォレスト405号室<br />
            TEL: 03-4500-3763<br />
            E-mail: info@maison.k-honest.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Inquiry reply email error:", error);
    return { success: false, error };
  }
}
