# 🏥 TeleMedAI - Next-Gen AI-Powered Telemedicine Platform

![TeleMedAI Banner](https://img.shields.io/badge/TeleMedAI-Healthcare_Revolution-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**TeleMedAI** is a comprehensive telemedicine platform that integrates advanced Artificial Intelligence to enhance the healthcare experience for both patients and doctors. It features real-time video consultations, AI-driven symptom analysis, automated pre-diagnosis reports, and seamless appointment management.

---

## 🚀 Key Features

### 👤 Patient Portal
**📹 Live Agentic AI Video Consultation:** Secure, high-quality video calls with doctors , pateints and AI agents directly in the browser.
*   **🤖 AI Symptom Intake:** Interactive chat with an AI assistant to analyze symptoms and generate a pre-diagnosis report.
*   **📅 Smart Appointment Booking:** Easy scheduling with doctors, including the ability to attach AI-generated reports.

*   **🏥 Nearby Clinics:** Integrated map view to find nearby healthcare facilities.
*   **📂 Medical History:** Secure storage and easy access to past medical reports and prescriptions.

### 👨‍⚕️ Doctor Portal
*   **dashboard:** Comprehensive dashboard to manage appointments and patient requests.
*   **📄 AI Insights:** View patient's pre-diagnosis reports and AI-generated insights during live consultations.
*   **💊 Digital Prescriptions:** Create and manage digital prescriptions effortlessly.
*   **📝 Consultation Notes:** Integrated tools for taking notes during patient interactions.

### 🧠 AI & ML Engine
*   **Symptom Analysis:** Natural language processing to understand patient symptoms.
*   **Pre-Diagnosis:** Generates preliminary diagnostic reports to aid doctors.
*   **Real-time Assistance:** Provides insights to doctors during live consultations.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Animations:** Framer Motion
*   **Real-time:** Socket.IO Client
*   **Maps:** React Leaflet

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Real-time:** Socket.IO

### AI Service
*   **Language:** Python
*   **Framework:** Flask
*   **Models:** LLM Integration (Groq/Llama)

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/TeleMedAI-Project.git
cd TeleMedAI-Project
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create a .env file based on .env.example
npm run dev
```

### 4. AI Service Setup
```bash
cd AI-ML
pip install -r requirements.txt
# Configure your AI API keys in .env
python app.py
```

---

## 📂 Project Structure

```
TeleMedAI-Project/
├── frontend/           # React TypeScript Application
│   ├── src/
│   │   ├── features/   # Feature-based modules (Patient, Doctor, Admin)
│   │   ├── components/ # Shared UI components
│   │   ├── services/   # API services
│   │   └── ...
├── backend/            # Node.js Express API
│   ├── models/         # Mongoose Models
│   ├── controllers/    # Route Controllers
│   ├── routes/         # API Routes
│   └── ...
├── AI-ML/              # Python AI Services
│   ├── app.py          # Flask Application
│   ├── chat_diagnosis.py # Diagnosis Logic
│   └── ...
└── ...
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by the TheQuadraSquad</sub>
</div>
