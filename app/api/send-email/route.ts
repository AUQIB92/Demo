import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function getStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return {
        gradient: '#0ea5e9, #06b6d4',
        badgeBg: '#e0f2fe',
        badgeText: '#0369a1',
        badgeLabel: '● Pending Approval',
        title: 'Booking Received! 🙌',
        message: (name: string, service: string) =>
          `Thank you, <strong>${name}</strong>! Your <strong>${service}</strong> service request has been received and is awaiting admin approval. We'll notify you as soon as it's confirmed.`,
        cta: 'View Booking Status',
        ctaBg: '#0ea5e9',
      }
    case 'confirmed':
      return {
        gradient: '#059669, #10b981',
        badgeBg: '#d1fae5',
        badgeText: '#065f46',
        badgeLabel: '✓ Approved',
        title: 'Booking Approved! 🎉',
        message: (name: string, service: string) =>
          `Great news, <strong>${name}</strong>! Your <strong>${service}</strong> service booking has been confirmed. Our team will arrive at your location on the scheduled date.`,
        cta: 'View in Dashboard',
        ctaBg: '#059669',
      }
    case 'cancelled':
      return {
        gradient: '#dc2626, #ef4444',
        badgeBg: '#fee2e2',
        badgeText: '#991b1b',
        badgeLabel: '✗ Not Approved',
        title: 'Booking Update',
        message: (name: string, service: string) =>
          `Hi <strong>${name}</strong>, unfortunately your <strong>${service}</strong> service booking could not be approved at this time. Please contact our support team for more details.`,
        cta: 'Call Support',
        ctaBg: '#1f2937',
      }
    default:
      return {
        gradient: '#6b7280, #9ca3af',
        badgeBg: '#f3f4f6',
        badgeText: '#4b5563',
        badgeLabel: status,
        title: 'Booking Update',
        message: (name: string) => `Hi ${name}, your booking status has been updated to ${status}.`,
        cta: 'View Details',
        ctaBg: '#0ea5e9',
      }
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: Request) {
  try {
    const { email, status, bookingId, serviceType, scheduledDate, timeSlot, customerName, totalAmount, address, district } = await request.json()

    if (!email || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const cfg = getStatusConfig(status)
    const idShort = bookingId ? bookingId.slice(-8) : '—'

    const subject = status === 'pending'
      ? `Booking Received - HR Security Services`
      : status === 'confirmed'
        ? `Booking #${idShort} Approved! - HR Security Services`
        : `Booking #${idShort} Update - HR Security Services`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f4f7f6; padding: 24px; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 80px -20px rgba(0,0,0,0.15); }
          .header { padding: 40px 40px 32px; text-align: center; background: linear-gradient(135deg, ${cfg.gradient}); position: relative; overflow: hidden; }
          .header::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%); }
          .header-icon { width: 64px; height: 64px; margin: 0 auto 16px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
          .header-icon svg { width: 32px; height: 32px; }
          .header h1 { color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; position: relative; }
          .header p { color: rgba(255,255,255,0.85); font-size: 15px; margin-top: 8px; position: relative; font-weight: 400; }
          .body { padding: 32px 40px 24px; }
          .status-bar { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; background: ${cfg.badgeBg}; color: ${cfg.badgeText}; }
          .greeting { font-size: 16px; color: #1f2937; font-weight: 600; margin-bottom: 12px; }
          .message { font-size: 14px; color: #6b7280; line-height: 1.7; margin-bottom: 24px; }
          .card { background: #f9fafb; border-radius: 20px; padding: 24px; border: 1px solid #f3f4f6; }
          .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 16px; }
          .row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
          .row:last-child { border-bottom: none; }
          .row-label { font-size: 13px; color: #6b7280; }
          .row-value { font-size: 13px; color: #1f2937; font-weight: 600; text-align: right; }
          .amount-value { font-size: 22px; font-weight: 800; color: #059669; }
          .cta { text-align: center; margin-top: 24px; }
          .cta a { display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; border-radius: 16px; font-size: 14px; font-weight: 700; text-decoration: none; background: ${cfg.ctaBg}; color: #ffffff; transition: all 0.2s; }
          .cta a:hover { filter: brightness(1.1); transform: translateY(-1px); }
          .footer { padding: 24px 40px 32px; border-top: 1px solid #f3f4f6; text-align: center; }
          .footer-logo { font-size: 18px; font-weight: 800; color: #1f2937; letter-spacing: -0.5px; }
          .footer-logo span { color: #0ea5e9; }
          .footer p { font-size: 12px; color: #9ca3af; margin-top: 8px; line-height: 1.6; }
          .footer .phone { font-weight: 600; color: #6b7280; }
          .divider { height: 3px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent); margin: 16px 0; }
          @media (max-width: 480px) { .header { padding: 32px 24px; } .body { padding: 24px; } .footer { padding: 20px 24px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-icon">
              ${status === 'pending' ? `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>` : status === 'confirmed' ? `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>` : `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>`}
            </div>
            <h1>${cfg.title}</h1>
            <p>${customerName || 'Dear Customer'}</p>
          </div>
          <div class="body">
            <div class="status-bar">${cfg.badgeLabel}</div>
            <p class="greeting">Hello ${customerName || 'there'},</p>
            <p class="message">${cfg.message(customerName || 'there', serviceType || 'your')}</p>
            <div class="card">
              <div class="card-title">Booking Summary</div>
              <div class="row">
                <span class="row-label">Booking ID</span>
                <span class="row-value" style="font-family: monospace;">#${idShort}</span>
              </div>
              ${serviceType ? `<div class="row"><span class="row-label">Service</span><span class="row-value">${serviceType}</span></div>` : ''}
              ${scheduledDate ? `<div class="row"><span class="row-label">Date</span><span class="row-value">${scheduledDate}</span></div>` : ''}
              ${timeSlot ? `<div class="row"><span class="row-label">Time</span><span class="row-value">${timeSlot}</span></div>` : ''}
              ${district ? `<div class="row"><span class="row-label">District</span><span class="row-value">${district}</span></div>` : ''}
              ${address ? `<div class="row"><span class="row-label">Location</span><span class="row-value">${address}</span></div>` : ''}
              ${totalAmount ? `
              <div class="row" style="border-bottom: none; margin-top: 8px; padding-top: 16px; border-top: 2px solid #e5e7eb;">
                <span class="row-label" style="font-size: 15px; font-weight: 700; color: #1f2937;">Total Amount</span>
                <span class="row-value amount-value">₹${Number(totalAmount).toLocaleString()}</span>
              </div>` : ''}
            </div>
            <div class="cta">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://hrsecurity.vercel.app'}/dashboard">
                ${cfg.cta} →
              </a>
            </div>
          </div>
          <div class="footer">
            <div class="footer-logo">HR <span>SECURITY</span></div>
            <p>
              Have questions? We're here 24/7<br>
              <span class="phone">📞 +91 7006 255 363</span> &nbsp;·&nbsp; <span>✉️ support@hrsecurity.in</span>
            </p>
            <div class="divider"></div>
            <p>
              HR Security Services · Intelligent surveillance solutions<br>
              © ${new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"HR Security" <notifications@hrsecurity.in>',
      to: email,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json({ success: true })
  }
}