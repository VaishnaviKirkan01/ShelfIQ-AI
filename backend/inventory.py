
from datetime import date, timedelta

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import func

from app.db.session import SessionLocal
from app.models.product import Product
from app.models.inventory import InventoryBatch

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])


class NewInventory(BaseModel):
    product_name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    quantity: int = Field(gt=0)
    expiry_date: date
    selling_price: float = Field(ge=0)
    unit_cost: float = Field(ge=0)
    shelf_life_days: int = Field(gt=0)


class StockUpdate(BaseModel):
    quantity_remaining: int = Field(ge=0)


def serialize_batch(batch, product):
    return {
        "batch_id": batch.batch_id,
        "product_id": batch.product_id,
        "category_batch": batch.category_batch,
        "received_at": batch.received_at.isoformat() if batch.received_at else None,
        "snapshot_date": batch.snapshot_date.isoformat() if batch.snapshot_date else None,
        "expiry_date": batch.expiry_date.isoformat() if batch.expiry_date else None,
        "initial_quantity": batch.initial_quantity,
        "quantity_remaining": batch.quantity_remaining,
        "days_to_expiry": batch.days_to_expiry,
        "avg_daily_sales_7d": batch.avg_daily_sales_7d,
        "expected_demand_before_expiry": batch.expected_demand_before_expiry,
        "unit_price": batch.unit_price,
        "unit_cost_batch": batch.unit_cost_batch,
        "discount_pct": batch.discount_pct,
        "expiry_risk_label": batch.expiry_risk_label,
        "waste_units_actual_simulated": batch.waste_units_actual_simulated,
        "product_name": product.product_name,
        "category_product": product.category,
        "shelf_life_days": product.shelf_life_days,
        "selling_price": product.selling_price,
        "unit_cost_product": product.unit_cost,
    }


@router.get("/")
def get_inventory(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
):
    db = SessionLocal()
    try:
        total = db.query(InventoryBatch).count()

        records = (
            db.query(InventoryBatch, Product)
            .join(Product, InventoryBatch.product_id == Product.product_id)
            .order_by(InventoryBatch.batch_id)
            .offset(offset)
            .limit(limit)
            .all()
        )

        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "items": [
                serialize_batch(batch, product)
                for batch, product in records
            ],
        }
    finally:
        db.close()


@router.get("/expiring")
def get_expiring_inventory(
    days: int = Query(default=3, ge=0, le=365)
):
    db = SessionLocal()
    try:
        today = date.today()
        last_day = today + timedelta(days=days)

        records = (
            db.query(InventoryBatch, Product)
            .join(Product, InventoryBatch.product_id == Product.product_id)
            .filter(
                InventoryBatch.expiry_date >= today,
                InventoryBatch.expiry_date <= last_day,
                InventoryBatch.quantity_remaining > 0,
            )
            .order_by(InventoryBatch.expiry_date)
            .all()
        )

        items = [
            serialize_batch(batch, product)
            for batch, product in records
        ]

        return {"days": days, "total": len(items), "items": items}
    finally:
        db.close()


@router.post("/")
def add_inventory(item: NewInventory):
    db = SessionLocal()
    try:
        name = item.product_name.strip()
        category = item.category.strip()

        if not name or not category:
            raise HTTPException(
                status_code=422,
                detail="Product name and category cannot be blank.",
            )

        today = date.today()
        days_to_expiry = (item.expiry_date - today).days

        if days_to_expiry < 0:
            raise HTTPException(
                status_code=422,
                detail="Expiry date cannot be in the past.",
            )

        product = (
            db.query(Product)
            .filter(func.lower(Product.product_name) == name.lower())
            .first()
        )

        if product is None:
            max_product_id = (
                db.query(func.max(Product.product_id)).scalar() or 1000
            )
            product = Product(
                product_id=max_product_id + 1,
                product_name=name,
                category=category,
                shelf_life_days=item.shelf_life_days,
                selling_price=item.selling_price,
                unit_cost=item.unit_cost,
            )
            db.add(product)
            db.flush()

        max_batch_id = (
            db.query(func.max(InventoryBatch.batch_id)).scalar() or 0
        )

        batch = InventoryBatch(
            batch_id=max_batch_id + 1,
            product_id=product.product_id,
            category_batch=category,
            received_at=today,
            snapshot_date=today,
            expiry_date=item.expiry_date,
            initial_quantity=item.quantity,
            quantity_remaining=item.quantity,
            days_to_expiry=days_to_expiry,
            avg_daily_sales_7d=0,
            expected_demand_before_expiry=0,
            unit_price=item.selling_price,
            unit_cost_batch=item.unit_cost,
            discount_pct=0,
            expiry_risk_label=int(days_to_expiry <= 3),
            waste_units_actual_simulated=0,
        )

        db.add(batch)
        db.commit()

        return {
            "message": "Inventory batch added successfully",
            "batch_id": batch.batch_id,
            "product_id": product.product_id,
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@router.patch("/{batch_id}")
def update_stock(batch_id: int, update: StockUpdate):
    db = SessionLocal()
    try:
        batch = (
            db.query(InventoryBatch)
            .filter(InventoryBatch.batch_id == batch_id)
            .first()
        )

        if batch is None:
            raise HTTPException(
                status_code=404,
                detail=f"Batch {batch_id} was not found.",
            )

        batch.quantity_remaining = update.quantity_remaining

        if batch.expiry_date:
            batch.days_to_expiry = (
                batch.expiry_date - date.today()
            ).days
            batch.expiry_risk_label = int(
                0 <= batch.days_to_expiry <= 3
            )

        db.commit()

        return {
            "message": "Stock updated successfully",
            "batch_id": batch_id,
            "quantity_remaining": update.quantity_remaining,
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@router.delete("/{batch_id}")
def delete_inventory(batch_id: int):
    db = SessionLocal()
    try:
        batch = (
            db.query(InventoryBatch)
            .filter(InventoryBatch.batch_id == batch_id)
            .first()
        )

        if batch is None:
            raise HTTPException(
                status_code=404,
                detail=f"Batch {batch_id} was not found.",
            )

        db.delete(batch)
        db.commit()

        return {
            "message": "Inventory batch deleted successfully",
            "batch_id": batch_id,
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
