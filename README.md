# PlaceMate 🏠

PlaceMate is a responsive real estate listing platform built with React. It allows users to securely register, manage property listings, and connect via social links. Enhanced with animations, CAPTCHA protection, and password strength validation, PlaceMate offers a user-friendly and secure experience.

## 🔐 Features

- ✅ Secure Registration
  - Eye icon to toggle password visibility
  - Password strength meter (Weak / Medium / Strong)
  - Validation rules: Uppercase, lowercase, number, special character, 8+ chars
  - CAPTCHA for bot protection
- 👤 Profile Page
  - Editable profile with name, email, and social media links
  - Links are shown on the main profile page for easy contact
- 🏡 Listings Management
  - Add, edit, and view property listings
  - Save your favorite listings
- 📊 User Analytics Section
- 🗺️ Embedded Google Map in Footer (e.g., Softwarica College)

## 🧰 Tech Stack

- **Frontend**: React + Tailwind CSS
- **Routing**: React Router
- **Form Validation**: React Hook Form + Yup
- **State Management**: Context API
- **Security**: JWT Auth, CAPTCHA, Input Sanitization
- **Icons**: React Icons

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance (local or Atlas)

### Setup

```bash
# Clone the repo
git clone (https://github.com/SumiSushmA/security-application-assignment.git)
cd placemate

# Install frontend dependencies
npm install

# Start development server
npm run dev
````

### .env (Frontend)

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

## 🛡️ Security Features

* Strong password requirements
* CAPTCHA for bot prevention
* JWT-based authentication
* Input sanitization to prevent XSS

## 📍 Footer Map Embed

```html
<iframe src="https://www.google.com/maps/embed?pb=..."
  width="600"
  height="450"
  style="border:0;"
  allowfullscreen
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

## 👤 Developer

**Sushma Sharma**
GitHub: [SumiSushmA](https://github.com/SumiSushmA)




