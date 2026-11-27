This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Billing invoices

The application requires a sign-in before dashboard and billing pages can be accessed. Seed the database with `npm run seed` to create or update the admin account (`jayambe` / `jayambe123`). Change this default password before deployment.

Create and save invoices from **Invoices → Create Invoice**. The invoice form uses available stock to populate its brand, vehicle type, chassis, motor, and battery details. Brand and vehicle type choices come from `VehicleModel.brand` and `VehicleModel.vehicleType`; set these values when adding or configuring vehicle models.

Vehicle base price is entered before tax. GST is calculated at the model's standard 5% rate, split into CGST/SGST for same-state sales and IGST for other states. RTO, insurance, and accessories are added separately; discount reduces the taxable vehicle value. Saved invoices appear in history and can be printed or saved as PDF from their invoice page.

The invoice history search matches invoice number, customer name, mobile number, and address, with invoice date range filters. Add vehicles from the dashboard's **Add Vehicle to Inventory** section; choose an existing model and enter its identifying and battery details.

Run `npx prisma migrate deploy` after updating the database schema. New stock models can set `brand` and `vehicleType`, and vehicles can set `batteryType`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
