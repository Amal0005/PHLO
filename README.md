# PHLO 🌌

**PHLO** is a premium, high-impact digital asset platform and portfolio designed for creators and photographers. It features a robust wallpaper marketplace with automated watermarking, secure payments, and a cinematic user experience.

![PHLO Desktop Preview](https://via.placeholder.com/1200x600/000000/FFFFFF?text=PHLO+PREMIUM+WALLPAPER+PLATFORM)

---

## 🛠 Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (for cinematic animations)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Maps:** [Mapbox GL](https://www.mapbox.com/)
- **Real-time:** [Socket.io Client](https://socket.io/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Processing:** [Sharp](https://sharp.pixelplumbing.com/) (Watermarking & Image Processing)
- **Caching & Sessions:** [Redis](https://redis.io/) (via [ioredis](https://github.com/redis/ioredis))
- **Security:** [JWT](https://jwt.io/), [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Payments:** [Stripe](https://stripe.com/)
- **Storage:** [AWS S3](https://aws.amazon.com/s3/)
- **AI/Vision:** [Google Cloud Vision](https://cloud.google.com/vision)

---

## ✨ Key Features

- **Cinematic UI/UX:** A minimalist, typography-heavy design with smooth transitions and premium aesthetics.
- **Dynamic Watermarking:** Automated "PHLO" watermark generation for image previews using Sharp and SVG tiling.
- **Secure Marketplace:** Integrated Stripe payment gateway for purchasing high-resolution assets.
- **Real-time Interaction:** Socket-driven notifications and updates.
- **Advanced Asset Management:** S3-backed storage with presigned URLs for secure downloads.
- **Automated Schedulers:** Background jobs for payment releases and subscription management.
- **Location Awareness:** Mapbox integration for asset categorization and discovery.
- **Multi-layered Security:** Google OAuth 2.0 and JWT-based authentication.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- AWS S3 Bucket
- Stripe Account
- Google Cloud Console Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/PHLO.git
   cd PHLO
   ```

2. **Setup Backend:**
   ```bash
   cd Backend
   npm install
   # Create a .env file based on .envExample
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../Frontend
   npm install
   # Create a .env file based on .envExample
   npm run dev
   ```

---

## 🏗 Architecture

The project follows a **Clean Architecture** pattern to ensure scalability and maintainability:

- **Domain:** Enterprise business rules and entities.
- **Application:** Application-specific business rules and use cases.
- **Adapters:** Converters between the domain/application and external frameworks (Routes, Controllers, Middlewares).
- **Framework:** External tools and frameworks (Database, Express, Logger).

---

## 📂 Project Structure

```text
PHLO/
├── Backend/           # Node.js + Express + Mongoose
│   ├── src/           # Source code
│   ├── nginx/         # Nginx configuration
│   └── Dockerfile     # Containerization
├── Frontend/          # React + Vite + Tailwind
│   ├── src/           # React components & logic
│   ├── public/        # Static assets
│   └── Dockerfile     # Containerization
└── .github/           # GitHub Actions & workflows
```

---

## ⚙️ Environment Variables

Ensure you have the following variables in your `.env` files:

### Backend `.env`
- `MONGO_URI`
- `JWT_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `STRIPE_SECRET_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS`

### Frontend `.env`
- `VITE_API_URL`
- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_MAPBOX_TOKEN`
- `VITE_GOOGLE_CLIENT_ID`

---

## 📄 License

This project is licensed under the ISC License.
