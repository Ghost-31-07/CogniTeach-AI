CogniTeach-Ai

> **Next-Generation AI Lesson Planner & Classroom Mastery Platform for Educators and Students**  
> *Transforming lesson creation, adaptive student diagnostics, doubt clearing, and academic honors with Google Gemini AI and Razorpay.*

---

## 🌟 Overview

**CogniTeach AI** is a full-stack educational SaaS platform created specifically for teachers and students. Built with React 19, TypeScript, Express, Google GenAI SDK, and Firebase Firestore, it bridges teacher preparation with active student learning:

1. **For Teachers (Faculty Role)**:
   - **AI Lesson Generator**: Create 3-in-1 instructional packages in seconds:
     - Structured Pedagogical Lesson Plans with step-by-step timelines and teacher guidance.
     - Differentiated Printable Student Worksheets (Advanced, Support, and ELL tiers).
     - Auto-Graded Quizzes with detailed answer keys and conceptual rationales.
   - **Student Mistake Analytics**: Visual diagnostic reports uncovering cognitive traps, linear proportionality biases, and remediation tips.
   - **Faculty Doubt Resolver Assistant**: AI-assisted drafting of encouraging pedagogical explanations for student questions.

2. **For Students (Scholar Role)**:
   - **Topic Diagnostic Probes & Quizzes**: Instant practice across 12 academic disciplines (Mathematics, Physics, Chemistry, Biology, CS & AI, History, Economics, etc.).
   - **Doubts Desk**: Submit questions, get clear step-by-step explanations with analogies, and clarify tricky concepts.
   - **Monthly Academic Honors Leaderboard**: Real-time cohort leaderboard celebrating top scholars with XP points, streak tracking, and achievement badges.

3. **Integrated Razorpay Payments**:
   - Seamless checkout supporting Indian UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay/Visa/Mastercard cards, and NetBanking across 50+ Indian banks.
   - Secure server-side Order Creation (`/api/razorpay/create-order`), HMAC SHA-256 signature verification (`/api/razorpay/verify-payment`), and Webhooks (`/api/razorpay/webhook`).
   - Sandbox test mode with instant 1-click test simulated verification.

---

## 🚀 Live Demo & Links

- **Development URL**: [https://ais-dev-yrrnzeweah6wa6xpmg3upa-569377070788.asia-southeast1.run.app](https://ais-dev-yrrnzeweah6wa6xpmg3upa-569377070788.asia-southeast1.run.app)
- **Shared Preview URL**: [https://ais-pre-yrrnzeweah6wa6xpmg3upa-569377070788.asia-southeast1.run.app](https://ais-pre-yrrnzeweah6wa6xpmg3upa-569377070788.asia-southeast1.run.app)

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend API**: Node.js, Express (`/api/router.ts`), Server-side Gemini AI proxy
- **AI Engine**: `@google/genai` SDK (`gemini-3.1-flash-lite`, `gemini-3.8-flash`, `gemini-flash-latest`)
- **Database & Persistence**: Firebase Firestore Database
- **Authentication**: Supabase Authentication (`@supabase/supabase-js`) with JWT sessions, email/password & Google OAuth
- **Payments Gateway**: Razorpay Orders API, HMAC signature verification, UPI & RuPay support

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/shikshaplan-ai.git
cd shikshaplan-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
# Gemini API Key (from Google AI Studio)
GEMINI_API_KEY="your-gemini-api-key"

# Razorpay API Credentials (optional for test mode; required for live orders)
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🏆 Monthly Student Honors Leaderboard

The platform features an authentic, lively monthly leaderboard celebrating student scholars:
- **Aarav Sharma** (Physics & Mechanics) - 1,280 XP
- **Ananya Iyer** (Mathematics & Calculus) - 1,140 XP
- **Rohan Verma** (Computer Science & AI) - 1,020 XP
- **Priyanshu Patel** (Chemistry & Organic Science) - 880 XP
- **Diya Sengupta** (History & Social Studies) - 760 XP
- **Aditya Kulkarni** (Economics & Business) - 650 XP
- **Meera Nambiar** (Biology & Life Sciences) - 580 XP
- **Ishaan Gupta** (Environmental Science) - 490 XP

Students earn XP through quizzes (+100 XP), zero-error answers (+25 XP), daily learning streaks (+50 XP), and doubt resolutions (+50 XP).

---

## 💳 Razorpay Pricing Plans

| Plan | Price | Features |
| :--- | :--- | :--- |
| **Basic (Free)** | ₹0 / mo | 3 AI Lesson Plans/mo, Printable worksheets, 5-question quizzes, Leaderboard access |
| **Pro Educator** | ₹799 / mo (or ₹7,999 / yr) | Unlimited AI Lesson Plans, 3-tier differentiated instruction, Mistake diagnostics, Doubt resolver, 1-click print PDF, Priority AI lane |

---

## 📄 License

MIT License. Designed with pride for educators and learners worldwide.
