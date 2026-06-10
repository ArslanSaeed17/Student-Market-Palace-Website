# 🎓 Student Market Palace

> A free campus marketplace for UMT students to buy and sell academic goods — built as an OSSD project.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-Vercel-black)
![Backend](https://img.shields.io/badge/Backend-Railway-purple)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ Frontend | [student-market-palace.vercel.app](https://student-market-palace.vercel.app) |
| ⚙️ Backend API | [Railway — /docs](https://student-market-place-documentation-production.up.railway.app/docs) |

---

## 📌 About

**Student Market Palace** is a full-stack web application that allows UMT (University of Management and Technology) students to:

- 📦 List items for sale (books, electronics, furniture, clothing, sports, etc.)
- 🔍 Browse and search available listings
- 💬 Contact sellers directly via WhatsApp or Gmail
- 👤 Manage their own profile and listings

> 100% free — no listing fees, no commissions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Supabase) |
| ORM | SQLAlchemy |
| Auth | JWT (JSON Web Tokens) |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

---

## 📁 Project Structure

```
Student-Market-Palace/
│
├── backend/
│   ├── main.py          # FastAPI app — all API endpoints
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── database.py      # Database connection setup
│   └── requirements.txt # Python dependencies
│
├── fronted/             # Static frontend (deployed on Vercel)
│   ├── index.html       # Home page — hero, latest listings, about, terms
│   ├── products.html    # Browse all listings with search & filter
│   ├── product.html     # Single product detail + contact seller
│   ├── sell.html        # Post a new listing (auth required)
│   ├── profile.html     # User profile + my listings (auth required)
│   ├── login.html       # Login page
│   ├── register.html    # Registration page
│   ├── css/
│   │   └── style.css    # Global dark theme design system
│   └── js/
│       ├── api.js       # All API calls to backend
│       └── auth.js      # Auth helpers, navbar, footer, card renderer
│
├── api/
│   └── chat.js          # Vercel serverless function (AI chatbot)
│
├── vercel.json          # Vercel deployment config
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register new user |
| `POST` | `/login` | ❌ | Login and get JWT token |
| `GET` | `/users/profile` | ✅ | Get logged-in user profile |
| `GET` | `/products` | ❌ | Get all listings (paginated) |
| `GET` | `/products/{id}` | ❌ | Get single product by ID |
| `GET` | `/products/search` | ❌ | Search listings by keyword |
| `GET` | `/products/filter` | ❌ | Filter by category & status |
| `POST` | `/products` | ✅ | Create new listing |
| `PUT` | `/products/{id}` | ✅ | Update own listing |
| `DELETE` | `/products/{id}` | ✅ | Delete own listing |

---

## 🚀 Local Setup

### Backend

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/Student-Market-Palace.git
cd Student-Market-Palace/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
echo "DATABASE_URL=postgresql://user:password@host/dbname" > .env
echo "SECRET_KEY=your_secret_key_here" >> .env

# 5. Run the server
uvicorn main:app --reload
```

Backend will be live at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Frontend

```bash
# Just open in browser — no build step needed
cd fronted/
# Open index.html in your browser
# OR use Live Server extension in VS Code
```

> ⚠️ Update `BASE_URL` in `fronted/js/api.js` to point to your local backend:
> ```javascript
> const BASE_URL = 'http://localhost:8000';
> ```

---

## 🌍 Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set **Root Directory** to `fronted`
4. Deploy — Vercel auto-deploys on every push

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project
2. Deploy from GitHub → select `backend/` folder
3. Add environment variables:
   ```
   DATABASE_URL=your_supabase_postgresql_url
   SECRET_KEY=your_jwt_secret_key
   ```
4. Railway auto-detects FastAPI and deploys

---

## 🔐 Environment Variables

### Backend (Railway)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `SECRET_KEY` | JWT signing secret key |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | API key for AI chatbot (optional) |

---

## 📦 Product Categories

| Emoji | Category |
|-------|----------|
| 📚 | Books |
| 💻 | Electronics |
| 🛋️ | Furniture |
| 👕 | Clothing |
| ⚽ | Sports |
| 📦 | Other |

---

## 🛡️ Features

- ✅ JWT Authentication (register, login, protected routes)
- ✅ Full CRUD for product listings
- ✅ Search by keyword
- ✅ Filter by category and status
- ✅ Contact Seller via WhatsApp & Gmail
- ✅ Dark theme with glassmorphism UI
- ✅ Responsive design
- ✅ Password strength meter
- ✅ Image URL preview when listing
- ✅ Product status — Available / Reserved / Sold
- ✅ About Us & Terms of Service sections
- ✅ AI Chatbot assistant (SMP Assistant)

---

## 👨‍💻 Developer

**Arslan Saeed**
- 🎓 University of Management and Technology (UMT), Lahore
- 🏛️ Department of Cyber Security
- 📧 [arslanbrall@gmail.com](mailto:arslanbrall@gmail.com)
- 💬 WhatsApp: [+92 300 8971489](https://wa.me/923008971489)
- 📞 Helpline: +92 307 9193634

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [Supabase](https://supabase.com/) — Open source Firebase alternative
- [Railway](https://railway.app/) — Backend deployment platform
- [Vercel](https://vercel.com/) — Frontend deployment platform
- UMT Department of Cyber Security — OSSD Course

---

<div align="center">
  <strong>Built with ❤️ for UMT Students</strong><br/>
  <sub>Student Market Palace — Buy & Sell on Campus</sub>
</div>
