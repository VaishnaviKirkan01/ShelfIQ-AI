
from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class InventoryBatch(Base):
    __tablename__ = "inventory_batches"

    batch_id = Column(Integer, primary_key=True, index=True)

    product_id = Column(
        Integer,
        ForeignKey("products.product_id"),
        nullable=False,
        index=True
    )

    category_batch = Column(String(50))
    received_at = Column(Date)
    snapshot_date = Column(Date)
    expiry_date = Column(Date)

    initial_quantity = Column(Integer, nullable=False)
    quantity_remaining = Column(Integer, nullable=False)

    days_to_expiry = Column(Integer)
    avg_daily_sales_7d = Column(Float)
    expected_demand_before_expiry = Column(Integer)

    unit_price = Column(Float)
    unit_cost_batch = Column(Float)
    discount_pct = Column(Integer)

    expiry_risk_label = Column(Integer)
    waste_units_actual_simulated = Column(Integer)

    product = relationship(
        "Product",
        back_populates="inventory_batches"
    )
