# Misk Studios - Studio Rental Platform

A modern, production-ready Next.js application for Misk Studios, a Tunisian podcast and content studio rental business.

## Features

- 🎯 **Modern Design**: Clean, minimal, and responsive design with Tailwind CSS
- 🏢 **Studio Showcase**: Beautiful cards displaying available studios with details
- 📱 **Responsive**: Works perfectly on all devices and screen sizes
- 🎨 **Interactive Modal**: Booking modal with photo gallery and form
- 📧 **Email Integration**: Nodemailer with Resend fallback for booking requests
- ✅ **Form Validation**: React Hook Form with Zod schema validation
- 🌍 **French Language**: Complete French UI and content
- ♿ **Accessible**: Focus traps, keyboard navigation, ARIA labels
- 🔍 **SEO Optimized**: Meta tags, Open Graph, structured data

## Tech Stack

- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **Email**: Nodemailer (primary) + Resend (fallback)
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd misk-studios
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your email configuration in `.env.local`:
   - For Gmail SMTP: Use app passwords, not regular passwords
   - For Resend: Get API key from resend.com
   - Set your admin email to receive booking requests

4. Add studio images:
   - Place studio images in `public/images/`
   - Update image paths in `src/data/studios.ts` if needed
   - Add hero image as `public/images/hero-studio.jpg`
   - Add Open Graph image as `public/images/og-image.jpg`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Email Configuration

The application supports two email providers:

### Option 1: SMTP (Nodemailer) - Primary
Configure your SMTP settings in `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Option 2: Resend - Fallback
If SMTP fails, the app will try Resend:
```env
RESEND_API_KEY=re_your_api_key
RESEND_FROM=noreply@your-domain.com
```

## Project Structure

```
src/
├── app/
│   ├── api/book/          # Booking API endpoint
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Homepage
├── components/
│   ├── BookingModal.tsx   # Booking form modal
│   ├── Footer.tsx         # Site footer
│   ├── PhotoGallery.tsx   # Image gallery
│   └── StudioCard.tsx     # Studio display card
├── data/
│   └── studios.ts         # Studio data
├── lib/
│   └── validations.ts     # Zod schemas
└── types/
    └── index.ts           # TypeScript types
```

## Studios Data

Studio information is managed in `src/data/studios.ts`. Each studio includes:
- Basic info (name, size, category, price)
- Description and equipment list
- Multiple images for the gallery
- Unique ID for bookings

## Customization

### Adding New Studios
Edit `src/data/studios.ts` to add or modify studio information.

### Styling
The app uses Tailwind CSS. Customize colors, spacing, and components by modifying the classes throughout the components.

### Content
All French content can be updated in the respective component files. Key areas:
- Homepage sections
- Studio data
- Form labels and validation messages
- Footer links

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Set environment variables on your hosting platform

## Production Checklist

- [ ] Configure email settings (SMTP or Resend)
- [ ] Add real studio images
- [ ] Update contact information
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Configure domain and SSL
- [ ] Test booking flow end-to-end
- [ ] Set up monitoring and error tracking

## Support

For questions or issues, please contact the development team or create an issue in the repository.

## License

This project is proprietary to Misk Studios.