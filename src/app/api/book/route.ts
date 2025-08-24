import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { bookingFormSchema } from '@/lib/validations';

// Initialize Resend (fallback) - only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the form data
    const validationResult = bookingFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { prenom, nom, email, telephone, ville, message, studioNom } = validationResult.data;

    // Email content
    const emailSubject = `Nouvelle demande de réservation - ${studioNom}`;
    const emailText = `
Nouvelle demande de réservation

Studio: ${studioNom}
Nom: ${prenom} ${nom}
Email: ${email}
Téléphone: ${telephone}
Ville: ${ville}

Message:
${message}

---
Envoyé depuis le site web Misk Studios
    `.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nouvelle demande de réservation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
    <h1 style="color: #2563eb; margin: 0;">Nouvelle demande de réservation</h1>
  </div>
  
  <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
    <h2 style="color: #374151; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Détails de la réservation</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Studio:</td>
        <td style="padding: 8px 0; color: #2563eb; font-weight: bold;">${studioNom}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Nom complet:</td>
        <td style="padding: 8px 0;">${prenom} ${nom}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email:</td>
        <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Téléphone:</td>
        <td style="padding: 8px 0;"><a href="tel:${telephone}" style="color: #2563eb;">${telephone}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Ville:</td>
        <td style="padding: 8px 0;">${ville}</td>
      </tr>
    </table>
    
    <h3 style="color: #374151; margin-top: 20px; margin-bottom: 10px;">Message:</h3>
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${message}</div>
  </div>
  
  <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
    <p>Envoyé depuis le site web Misk Studios</p>
  </div>
</body>
</html>
    `;

    // Try Nodemailer first (default)
    let emailSent = false;
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL || 'admin@misk-studios.com',
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        });

        emailSent = true;
        console.log('Email sent successfully via Nodemailer');
      } catch (nodemailerError) {
        console.error('Nodemailer failed:', nodemailerError);
      }
    }

    // Fallback to Resend if Nodemailer failed or isn't configured
    if (!emailSent && resend) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM || 'noreply@misk-studios.com',
          to: process.env.ADMIN_EMAIL || 'admin@misk-studios.com',
          subject: emailSubject,
          html: emailHtml,
        });

        emailSent = true;
        console.log('Email sent successfully via Resend');
      } catch (resendError) {
        console.error('Resend failed:', resendError);
      }
    }

    if (!emailSent) {
      throw new Error('Both email services failed');
    }

    return NextResponse.json(
      { message: 'Demande de réservation envoyée avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
