# Student Market Palace — OSSD Project

## Project Structure
```
OSSD_Project/
├── backend/         ← FastAPI (deploy to Railway)
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── runtime.txt
└── frontend/        ← Static HTML (open in browser or deploy to Netlify/Vercel)
    ├── index.html
    ├── products.html
    ├── product.html
    ├── login.html
    ├── register.html
    ├── sell.html
    ├── profile.html
    ├── css/style.css
    └── js/
        ├── api.js
        └── auth.js
```

## Backend Deployment (Railway)
1. Push the `backend/` folder to GitHub
2. Connect repo to Railway
3. Set this environment variable in Railway:
   ```
   DATABASE_URL=postgresql://postgres.lawojzoxdupovarguqmg:Maher%40123s12@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
   ```
4. Railway will auto-deploy

## Frontend Setup
1. Open `frontend/js/api.js`
2. Replace `YOUR-RAILWAY-APP` with your actual Railway URL:
   ```js
   const BASE_URL = 'https://your-actual-app.up.railway.app';
   ```
3. Open `index.html` in a browser — or deploy frontend folder to Netlify (drag & drop)

## Pages
| Page | Description |
|------|-------------|
| index.html | Homepage with search & categories |
| products.html | Browse all listings with filters |
| product.html | Single product detail + edit/delete |
| login.html | User login |
| register.html | New account registration |
| sell.html | Post a new listing (auth required) |
| profile.html | User profile + their listings (auth required) |
