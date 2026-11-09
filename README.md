# 🥗 ShelfIQ – AI-Powered Food Inventory & Waste Management System

ShelfIQ is an AI-powered food inventory management platform designed to help businesses monitor stock, track expiration dates, forecast demand, and reduce food waste through data-driven insights.

The platform combines inventory management, machine learning, and interactive dashboards to support smarter purchasing, efficient stock management, and waste reduction.

---

## 🚀 Project Overview

Food businesses often face challenges such as overstocking, expired products, unpredictable demand, and unnecessary food waste.

ShelfIQ addresses these challenges by providing:

- Centralized food inventory management
- Expiry date and batch tracking
- AI-based demand forecasting
- Expiry risk prediction
- Inventory recommendations
- Waste analytics and reporting
- Interactive dashboard and visualizations

---

## ✨ Key Features

### 📦 Inventory Management
- Add, update, and delete products
- Manage product quantities and inventory batches
- Track stock levels
- Monitor inventory availability

### ⏰ Expiry Risk Monitoring
- Track product expiration dates
- Identify products approaching expiry
- Monitor expiry-related inventory risks
- Support proactive stock management

### 📊 AI-Based Demand Forecasting
- Analyze historical sales and inventory data
- Forecast future product demand
- Support better purchasing and stocking decisions

### 🤖 Intelligent Recommendations
- Identify inventory requiring attention
- Support stock optimization
- Recommend actions to reduce potential waste

### 📈 Waste Analytics
- Monitor food waste patterns
- Analyze waste-related metrics
- Generate reports to support waste reduction

### 📉 Interactive Dashboard
- Inventory overview
- Product and stock information
- Expiry risk insights
- Forecasting and waste analytics

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI
- REST APIs

### Database
- MySQL
- SQL

### Machine Learning & Data Science
- Python
- Pandas
- NumPy
- Scikit-learn
- Matplotlib
- Seaborn
- Jupyter Notebook

### Development Tools
- Git
- GitHub
- VS Code
- Docker

---

## 🏗️ Project Architecture

```text
ShelfIQ
│
├── frontend/          # React + TypeScript application
│
├── backend/           # FastAPI backend and APIs
│
├── ml/                # Machine learning workflows
│   ├── data/
│   ├── notebooks/
│   ├── src/
│   └── artifacts/
│
├── database/          # Database schema and seed data
│
├── datasets/          # Project datasets
│
├── scripts/           # Data import and validation scripts
│
├── docs/              # Documentation
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following:

- Python 3.13
- Node.js and npm
- MySQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/VaishnaviKirkan01/WasteWise-AI.git
```

Navigate to the project:

```bash
cd WasteWise-AI
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
py -3.13 -m venv .venv
```

Activate it on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the environment variables using your `.env.example` file.

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 📊 Machine Learning Workflow

ShelfIQ follows a data-driven machine learning workflow:

1. Data collection
2. Data cleaning and validation
3. Exploratory Data Analysis (EDA)
4. Feature engineering
5. Model training
6. Model evaluation
7. Prediction and integration
8. Visualization of insights

Potential ML applications include:

- Demand forecasting
- Expiry risk prediction
- Inventory optimization
- Food waste analysis

---

## 🎯 Project Objectives

- Reduce avoidable food waste
- Improve inventory visibility
- Predict future product demand
- Identify products at expiry risk
- Support data-driven inventory decisions
- Improve operational efficiency

---

## 🔮 Future Enhancements

- Real-time inventory alerts
- Automated expiry notifications
- Advanced demand forecasting
- Enhanced recommendation engine
- Role-based authentication
- Cloud deployment
- Model performance monitoring
- Automated inventory optimization

---

## 👩‍💻 Author

**Vaishnavi Kirkan**

AI Engineering | Data Science | Machine Learning

GitHub: [VaishnaviKirkan01](https://github.com/VaishnaviKirkan01)

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

---

*ShelfIQ — Smarter Inventory. Less Waste. Better Decisions.*
