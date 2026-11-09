
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.db.session import SessionLocal
from app.models.product import Product
from app.models.inventory import InventoryBatch

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


# Request model for adding a product
class ProductCreate(BaseModel):
    product_name: str
    category: str
    shelf_life_days: int
    selling_price: float
    unit_cost: float


# Request model for updating a product
class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    category: Optional[str] = None
    shelf_life_days: Optional[int] = None
    selling_price: Optional[float] = None
    unit_cost: Optional[float] = None


# Convert database product into JSON
def serialize_product(product):
    return {
        "product_id": product.product_id,
        "product_name": product.product_name,
        "category": product.category,
        "shelf_life_days": product.shelf_life_days,
        "selling_price": product.selling_price,
        "unit_cost": product.unit_cost
    }


# GET: Display all products
@router.get("/")
def get_products():
    db = SessionLocal()

    try:
        products = db.query(Product).order_by(Product.product_id).all()

        return {
            "total": len(products),
            "products": [serialize_product(p) for p in products]
        }

    finally:
        db.close()


# GET: Display one product
@router.get("/{product_id}")
def get_product(product_id: int):
    db = SessionLocal()

    try:
        product = db.query(Product).filter(
            Product.product_id == product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        return serialize_product(product)

    finally:
        db.close()


# POST: Add a new product
@router.post("/")
def add_product(data: ProductCreate):
    db = SessionLocal()

    try:
        product = Product(
            product_name=data.product_name,
            category=data.category,
            shelf_life_days=data.shelf_life_days,
            selling_price=data.selling_price,
            unit_cost=data.unit_cost
        )

        db.add(product)
        db.commit()
        db.refresh(product)

        return {
            "message": "Product added successfully",
            "product": serialize_product(product)
        }

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


# PATCH: Update product details
@router.patch("/{product_id}")
def update_product(product_id: int, data: ProductUpdate):
    db = SessionLocal()

    try:
        product = db.query(Product).filter(
            Product.product_id == product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(product, field, value)

        db.commit()
        db.refresh(product)

        return {
            "message": "Product updated successfully",
            "product": serialize_product(product)
        }

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


# DELETE: Delete product only if no inventory batches are linked
@router.delete("/{product_id}")
def delete_product(product_id: int):
    db = SessionLocal()

    try:
        product = db.query(Product).filter(
            Product.product_id == product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        linked_batch = db.query(InventoryBatch).filter(
            InventoryBatch.product_id == product_id
        ).first()

        if linked_batch:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete product because inventory batches are linked to it"
            )

        db.delete(product)
        db.commit()

        return {
            "message": "Product deleted successfully",
            "product_id": product_id
        }

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()
