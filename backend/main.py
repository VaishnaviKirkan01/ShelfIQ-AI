from products import router as products_router
from inventory import router as inventory_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Run this app from the backend directory with: python -m uvicorn main:app --reload
from inventory import router as inventory_router

app = FastAPI(
    title="WasteWise AI",
    description="Food inventory and waste management system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventory_router)

app.include_router(products_router)

@app.get("/")
def home():
    return {"message": "Welcome to WasteWise AI", "status": "Backend is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
