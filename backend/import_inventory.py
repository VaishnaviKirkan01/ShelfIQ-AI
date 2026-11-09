
import pandas as pd

from app.db.session import SessionLocal
from app.models.product import Product
from app.models.inventory import InventoryBatch
from app.db.base import Product, InventoryBatch


CSV_FILE = "datasets/processed/website_inventory.csv"


def import_inventory():
    db = SessionLocal()

    try:
        df = pd.read_csv(CSV_FILE)

        # Get unique products from the inventory dataset.
        products_df = df[
            [
                "product_id",
                "product_name",
                "category_product",
                "shelf_life_days",
                "selling_price",
                "unit_cost_product",
            ]
        ].drop_duplicates(subset=["product_id"])

        # Insert products that do not already exist.
        existing_product_ids = {
            row[0] for row in db.query(Product.product_id).all()
        }

        new_products = []

        for _, row in products_df.iterrows():
            product_id = int(row["product_id"])

            if product_id not in existing_product_ids:
                new_products.append(
                    Product(
                        product_id=product_id,
                        product_name=row["product_name"],
                        category=row["category_product"],
                        shelf_life_days=int(row["shelf_life_days"]),
                        selling_price=float(row["selling_price"]),
                        unit_cost=float(row["unit_cost_product"]),
                    )
                )

        db.add_all(new_products)
        db.flush()

        # Insert inventory batches that do not already exist.
        existing_batch_ids = {
            row[0] for row in db.query(InventoryBatch.batch_id).all()
        }

        new_batches = []

        date_columns = ["received_at", "snapshot_date", "expiry_date"]

        for column in date_columns:
            df[column] = pd.to_datetime(
                df[column], errors="coerce"
            ).dt.date

        for _, row in df.iterrows():
            batch_id = int(row["batch_id"])

            if batch_id not in existing_batch_ids:
                new_batches.append(
                    InventoryBatch(
                        batch_id=batch_id,
                        product_id=int(row["product_id"]),
                        category_batch=row["category_batch"],
                        received_at=row["received_at"],
                        snapshot_date=row["snapshot_date"],
                        expiry_date=row["expiry_date"],
                        initial_quantity=int(row["initial_quantity"]),
                        quantity_remaining=int(row["quantity_remaining"]),
                        days_to_expiry=int(row["days_to_expiry"]),
                        avg_daily_sales_7d=float(row["avg_daily_sales_7d"]),
                        expected_demand_before_expiry=int(
                            row["expected_demand_before_expiry"]
                        ),
                        unit_price=float(row["unit_price"]),
                        unit_cost_batch=float(row["unit_cost_batch"]),
                        discount_pct=int(row["discount_pct"]),
                        expiry_risk_label=int(row["expiry_risk_label"]),
                        waste_units_actual_simulated=int(
                            row["waste_units_actual_simulated"]
                        ),
                    )
                )

        db.add_all(new_batches)
        db.commit()

        print("IMPORT COMPLETED SUCCESSFULLY")
        print("New products imported:", len(new_products))
        print("New inventory batches imported:", len(new_batches))

        print("Total products in database:",
              db.query(Product).count())

        print("Total inventory batches in database:",
              db.query(InventoryBatch).count())

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    import_inventory()
