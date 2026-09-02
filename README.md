<div align="center">

# 📁 DocTransfer

### Secure Document Sharing, Virtual Data Room (VDR) & E-Signature Suite with Zero-Knowledge Encryption

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-database-setup-supabase">Database Setup</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

</div>

---

## 🌟 Overview

**DocTransfer** is a modern, privacy-first document sharing and Virtual Data Room (VDR) platform. Designed for startups, legal teams, healthcare providers, real estate, and financial institutions, DocTransfer ensures your sensitive files, pitch decks, contracts, and confidential documents are protected by client-side cryptography, forensic DRM, and real-time access telemetry.

Whether you need a DocSend alternative, an e-signature suite, or an enterprise virtual data room, DocTransfer gives you complete control without vendor lock-in.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔒 **Client-Side Zero-Knowledge Encryption** | Documents are encrypted before leaving the browser using **OpenPGP** and **AES-256-GCM**, ensuring server admins cannot inspect sensitive content. |
| 📁 **Virtual Data Rooms (VDR)** | Organize multi-file deal rooms with granular permissions, self-destruct timers, burn-after-reading links, and download toggles. |
| ✍️ **E-Signature Suite & Biometrics** | Multi-party document signing, customizable signature placement, tamper-evident audit trails, and biometric WebAuthn verification. |
| 🛡️ **Forensic Watermarking & DRM** | Dynamic viewer email watermarks, copy protection, print/download restrictions, and screen capture prevention overlays. |
| 📊 **Real-Time Analytics & Heatmaps** | Track viewer engagement per page, time spent, geolocation, device analytics, and document conversion funnels. |
| 🚀 **Programmatic SEO (pSEO) Engine** | Over 600 pre-rendered, high-converting industry and template landing pages built directly into the app. |
| 🌐 **Multi-Language Support (i18n)** | Full internationalization support with instant language switching. |
| ☁️ **Google Drive & Cloud Sync** | Direct document import and cloud storage integrations. |

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling & Animations**: Vanilla CSS Design System, [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Cryptography & Security**: [OpenPGP.js](https://openpgpjs.org/), [Crypto-JS](https://cryptojs.gitbook.io/docs/), WebCrypto API, SimpleWebAuthn
- **PDF & Document Engine**: [pdf-lib](https://pdf-lib.js.org/), [react-pdf](https://projects.wojtekmaj.pl/react-pdf/), [pdfjs-dist](https://mozilla.github.io/pdf.js/)
- **Backend & Database**: [Supabase](https://supabase.com) (PostgreSQL, Row-Level Security, Auth, Storage, Edge Functions)
- **Analytics & Visualizations**: [Recharts](https://recharts.org/)
- **Internationalization**: [i18next](https://www.i18next.com/)

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher, v20/v22 LTS recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A free [Supabase](https://supabase.com) account

### 1. Clone the Repository

```bash
git clone https://github.com/simplegithubs/DocTransfer3949.git
cd DocTransfer3949
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Duplicate the template configuration file:

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 4. Start Local Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Setup (Supabase)

DocTransfer uses Supabase for database tables, Row Level Security (RLS) policies, and storage buckets.

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the migration scripts located in the `supabase/migrations/` directory in chronological order, or run [`complete_setup.sql`](file:///c:/Users/roush/Downloads/doc/DocTransfer-main/complete_setup.sql).
4. Create a public/authenticated storage bucket named `documents` under **Storage**.
5. Copy your **Project URL** and **anon public key** from `Project Settings -> API` into your `.env` file.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
| :--- | :---: | :--- |
| `VITE_SUPABASE_URL` | **Yes** | URL of your Supabase project instance |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | Supabase anonymous / public API key |
| `VITE_GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID for Google Drive file picker |
| `VITE_GOOGLE_API_KEY` | Optional | Google Cloud API key with Drive API enabled |
| `VITE_RAZORPAY_KEY_ID` | **Yes** | Razorpay Key ID (e.g. `rzp_live_...` or `rzp_test_...`) |
| `VITE_RAZORPAY_PRO_PLAN_ID` | **Yes** | Razorpay Pro subscription plan ID |
| `VITE_RAZORPAY_BUSINESS_PLAN_ID` | **Yes** | Razorpay Business subscription plan ID |
| `VITE_RAZORPAY_DATAROOM_PLAN_ID` | **Yes** | Razorpay Virtual Data Room subscription plan ID |
| `RAZORPAY_KEY_SECRET` | **Yes (Backend)** | Razorpay Secret Key (set in Supabase Secrets for signature verification) |

---

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Build command: `npm run build`
5. Output directory: `dist`

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Connect your repository to [Netlify](https://netlify.com).
2. Configure environment variables in Site settings.
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## 🤝 Contributing

We welcome contributions from the open-source community! 

Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests or opening issues.

```bash
# 1. Fork the repo & create your branch from main
git checkout -b feat/my-awesome-feature

# 2. Verify type checks and linting before committing
npm run lint
npm run build

# 3. Commit using Conventional Commits
git commit -m "feat: add watermarking customization option"

# 4. Push to your fork and submit a Pull Request
```

---

## 🔒 Security & Vulnerability Reporting

Security and privacy are fundamental to DocTransfer. If you discover a security vulnerability, please review our [Security Policy](SECURITY.md) to report it responsibly.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for a privacy-first web. Star ⭐ the repository if you find it helpful!</sub>
</div>