# 🌱 Agro Farm Investment Platform

A modern agricultural investment platform designed to connect investors with farm projects through a transparent, digital investment experience.

The platform provides an organized workflow for discovering agricultural projects, submitting investment requests, completing KYC verification, tracking ownership, and managing farm investment activities.

## ✨ Features

* 🌾 Agricultural project discovery
* 💼 Investment and share-package management
* 📝 KYC submission and verification workflow
* 📊 Investment and ownership tracking
* 📈 Dynamic project reporting
* 🔐 Secure authentication and authorization
* 🛠️ Admin dashboard for platform management
* 📋 Investment request management
* 🔔 Automated notification workflows
* 📰 CMS-based blog/content management
* 📱 Responsive and modern user interface

## 🛠️ Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Supabase**
* **PostgreSQL**
* **Supabase Auth**
* **Supabase Storage**
* **Row Level Security (RLS)**

## 📂 Project Structure

```text
Agro-Farm-Investment-Platform/
│
├── app/
├── components/
├── public/
├── lib/
├── types/
├── supabase/
│
├── .env.example
├── .gitignore
├── next.config.*
├── package.json
├── package-lock.json
├── postcss.config.*
├── tailwind.config.*
├── tsconfig.json
└── README.md
```

> The exact structure may vary depending on the current repository version.

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm
* Git
* Supabase project

### Clone the Repository

```bash
git clone https://github.com/DevRomizKhan/Agro-Farm-Investment-Platform.git
```

### Navigate to the Project

```bash
cd Agro-Farm-Investment-Platform
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and configure the required Supabase credentials.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Never commit environment files containing private credentials.

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 🔐 Security

The platform uses Supabase authentication, PostgreSQL, and **Row Level Security (RLS)** to help protect application data and control access to user-specific resources.

## 🎯 Project Goals

* Digitize agricultural investment workflows
* Provide transparent project information
* Simplify investor onboarding and KYC
* Improve investment tracking
* Provide centralized administrative management
* Create a scalable foundation for agricultural investment services

## 👨‍💻 Developer

**Romiz Khan**

GitHub:
https://github.com/DevRomizKhan

Repository:
https://github.com/DevRomizKhan/Agro-Farm-Investment-Platform

---

<div align="center">

**🌱 Agro Farm Investment Platform**

Built with Next.js, TypeScript & Supabase

</div>
