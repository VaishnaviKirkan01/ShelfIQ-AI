
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship

from app.db.session import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    shelf_life_days = Column(Integer, nullable=False)
    selling_price = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)

    inventory_batches = relationship(
        "InventoryBatch",
        back_populates="product"
    )
