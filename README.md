# 360° Ghar - AI & VR Real Estate Search Portal

Welcome to **360° Ghar**, a next-generation real estate matching platform built for the Gurgaon & NCR market. By combining semantic search capabilities with immersive property profiles, 360° Ghar changes the way people find their dream homes.

[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite_8-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](#)
[![OpenRouter](https://img.shields.io/badge/OpenRouter_AI-000000?style=flat-square&logo=openai&logoColor=white)](#)

---

## ✨ Features

* **🗣️ Voice & Semantic Search**: Skip check-boxes. Describe your ideal home in plain English or speak directly using the built-in browser Web Speech API.
* **🧠 AI Search Parser**: Translates natural queries (e.g., *"3 BHK under 2 Crore near Metro in Sector 50"*) into structured filters using the `openrouter/free` model router, falling back to a custom local regex engine if offline.
* **📊 Precision Match Scoring**: A custom scoring algorithm calculates property suitability percentages (0–100%) in real-time, sorting results by relevance.
* **💡 AI Suitability Advisor**: Hover over or click a listing to see a custom-generated suitability advisory highlighting exactly how that property fits your initial query.
* **⚖️ Side-by-Side Comparison**: Select any two properties to compare prices, floor levels, areas, direction facings, and matching scores in a side-by-side analysis grid.
* **🕶️ Virtual Reality Portals**: Preview high-resolution simulated 360° spatial walkthroughs and schedule VR tours with the click of a button.

---

## 🛠️ Setup & Installation

Get the project running locally in a few quick steps:

### 1. Clone the repository
```bash
git clone https://github.com/ShouryaAgrawal0007/360-Ghar-Assignment.git
cd 360-Ghar-Assignment
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add Environment Keys
Create a `.env` file in the root directory and add your OpenRouter API key:
```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```
*Note: If no API key is specified, the application will automatically fall back to its robust local matching and parsing engines.*

### 4. Run the Dev Server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser to experience the platform.

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite 8 |
| **Styling & Theme** | Tailwind CSS v4.0 + Custom CSS Gradients & Animations |
| **AI Integration** | OpenRouter API (`openrouter/free`) |
| **Icons & Media** | Lucide React + Unsplash High-Res Real Estate Assets |
| **Voice Processing** | Web Speech API (Browser Native) |

---

*Built for the Software Developer Intern assignment at 360 Ghar.*