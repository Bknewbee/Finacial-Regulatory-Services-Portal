# Financial Regulatory Services Portal

A regulatory intelligence platform designed to simplify compliance, licensing, and document management for financial institutions in Botswana. Built to support startups, investors, and regulators through intelligent automation and accessible legal infrastructure.

## Key Features

- **Document Upload & Management** — Acts, forms, directives, policies
- **Checklist Generator** — Automatically compile regulatory steps from context
- **AI Chatbot (Ollama)** — Ask questions using natural language and get context-aware answers
- **Smart Search** — MongoDB Atlas Search across documents, tags, metadata
- **Role-Based Access** — Admin vs. User dashboards
- **Events & News** — Keep up with regulatory updates

## Tech Stack

| Layer      | Tools/Frameworks                            |
| ---------- | ------------------------------------------- |
| Frontend   | Next.js, TypeScript, Tailwind CSS, Flowbite |
| Backend    | Node.js, Express-style API routes           |
| AI         | Ollama (Local LLM), LangChain               |
| Database   | MongoDB Atlas                               |
| Storage    | AWS S3 (secure document storage)            |
| Auth       | Passport.js (JWT strategy)                  |
| Deployment | Hostinger VPS                               |

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Bknewbee/Finacial-Regulatory-Services-Portal.git
cd Finacial-Regulatory-Services-Portal
npm install
```

Create a `.env.local` file from the example and add your credentials:

```env
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
OLLAMA_API_URL=http://localhost:11434
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app            → Pages and route logic
/components     → Reusable UI components
/lib            → Utility functions (e.g., s3, mongodb, ollama)
/api            → Server routes (file uploads, search, auth)
```

## Roadmap

- [x] Intelligent document search
- [x] Checklist generation
- [x] AI Chatbot
- [x] PDF checklist export
- [ ] Regulatory audit trail
- [ ] Auto Document field generation
- [ ] Auto Checklist generation based on selected documents
- [ ] Multi-lingual support

## Contributing

PRs welcome! To contribute:

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe feature"
git push origin feature/your-feature
```

Open a pull request.

## 📄 License

MIT © 2025 Ezer Bhuka — Nest 009
