# LegalEase

## Purpose
LegalEase is a digital platform that connects legal seekers, clients, and businesses with talented lawyers. The platform allows users to browse, discover, and hire legal experts. Lawyers can offer and manage their legal services, while an admin oversees the entire system.

## Live URL
[Live Deployment](#) *(The app runs within the AI Studio preview environment)*

## Key Features
- **Role-based Dashboards**: Separate UI workflows for Users (Clients), Lawyers, and Admins.
- **Authentication**: JWT-based login and registration.
- **Lawyer Discovery**: Search and browse specialized lawyers with Framer Motion animations.
- **Hiring & Payment Flow**: Users can request to hire lawyers, who can accept or reject. If accepted, users proceed to payment via Stripe.
- **Comment System**: Verify-hire-first commenting system for reviews.
- **Profile Management**: Profile picture changes, specialization selection, and hourly rate management.

## Tech Stack & Packages
This uses the MERN stack architecture via Vite + Node.js (Express) compiled backend:
- `react`, `react-router-dom`: Frontend UI framework and routing.
- `tailwindcss`, `lucide-react`, `framer-motion`: Styling, responsive layout, animations, and icons.
- `express`, `mongoose`: Server and MongoDB integration.
- `jsonwebtoken`, `bcryptjs`: Security and authentication.
- `stripe`: Secure payment intent integration.
- `react-hot-toast`: Error/Success messaging.
- `axios`: Data fetching wrapper.
