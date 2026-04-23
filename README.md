# 🎬 My Cinema

A personal movie streaming site that streams videos directly from **Google Drive** — built with Next.js and deployable on Vercel for free.

---

## ✨ Features

- 🎥 Stream movies directly from your Google Drive folder
- 🔍 Real-time search to find movies instantly
- 🖼️ Auto thumbnail from Google Drive
- 📱 Fully responsive — works on mobile, tablet, and desktop
- 🔒 API Key is kept secret on the server (not exposed to browser)
- ⚡ Fast and lightweight — no database needed

---

## 🚀 Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/your-username/my-cinema.git
cd my-cinema
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root folder:

```env
GOOGLE_API_KEY=your_google_api_key_here
DRIVE_FOLDER_ID=your_google_drive_folder_id_here
```

> ⚠️ Never push `.env.local` to GitHub. It's already in `.gitignore`.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 How to Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services → Enable APIs**
4. Search for **Google Drive API** and enable it
5. Go to **APIs & Services → Credentials → Create Credentials → API Key**
6. Copy the API key and paste it in `.env.local`

---

## 📁 How to Get Drive Folder ID

1. Open [Google Drive](https://drive.google.com)
2. Navigate to the folder containing your movies
3. Look at the URL — the Folder ID is the long string at the end:

```
https://drive.google.com/drive/folders/THIS_IS_YOUR_FOLDER_ID
```

4. Make sure the folder is set to **"Anyone with the link → Viewer"**

---

## ☁️ Deploy on Vercel

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **New Project** → Select your repository → Click **Import**
4. Before deploying, add Environment Variables:

| Name | Value |
|------|-------|
| `GOOGLE_API_KEY` | Your Google API Key |
| `DRIVE_FOLDER_ID` | Your Drive Folder ID |

5. Click **Deploy** — your site will be live in minutes!

---

## 📁 Project Structure

```
my-cinema/
├── app/
│   ├── api/
│   │   └── movies/
│   │       └── route.ts      # Server-side Google Drive API call
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page UI
├── public/                   # Static assets
├── .env.local.example        # Environment variable template
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🛠️ Built With

- [Next.js](https://nextjs.org/) — React framework
- [Google Drive API v3](https://developers.google.com/drive/api/v3/reference) — Fetch video files
- [Vercel](https://vercel.com/) — Hosting and deployment

---

## 📝 License

This project is for personal use only.
