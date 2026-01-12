# 🧠 DeepSearch – AI Research Agent

DeepSearch is an AI-powered research assistant that helps users generate structured research reports by first asking intelligent clarifying questions and then producing a comprehensive analysis.

Unlike simple chatbots, DeepSearch behaves like an **AI research agent**, planning and generating research based on user intent.

---

## 🚀 Features

- 🤖 AI-generated clarifying questions
- 🧩 Multi-step research pipeline
- 📊 Live research activity tracking
- ⏱️ Research time indicator
- 🌗 Light / Dark theme (desktop & mobile)
- 📄 Structured research report output
- ⚡ Real-time streaming responses
- 🧠 Free-mode support (no external search required)

---

## 🛠 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **AI SDK (`ai`)**
- **OpenRouter (LLaMA models)**
- **Tailwind CSS**
- **ShadCN UI**
- **Zod**
- **Vercel**

---

## 📂 Project Structure
```
src/
├── app/
│ ├── api/
│ │ ├── generate-questions/
│ │ └── deep-research/
│ ├── layout.tsx
│ └── page.tsx
├── components/
│ ├── ui/
│ │ └── deep-research/
│ ├── ThemeProvider.tsx
│ └── ThemeToggle.tsx
├── store/
│ └── deepResearch.ts

```
---

## ⚙️ Setup & Run Locally

###  Clone the repo
```bash
git clone https://github.com/AadiSharma49/DeepSearch-AI-Agent.git
cd DeepSearch-AI-Agent
```
### Install dependencies
```bash
npm install

```
### Add environment variables
Create .env.local
```bash
OPENROUTER_API_KEY=your_api_key_here
```
### Run dev server
```
npm run dev
```
### Build for production
```
npm run build
```
---
### Deployment
#### This project is Vercel-ready.
---
### Future Improvements
- Cache questions per topic
- Regenerate questions button
- User-selected question count
- Authentication (login)
- Save research history
- Server-side PDF export
- Faster (<500ms) question generation

---
### Author
#### Aaditya Sharma
#### Built as an advanced AI + Fullstack portfolio project.
