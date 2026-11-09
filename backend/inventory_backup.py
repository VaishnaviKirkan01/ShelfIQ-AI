
from pathlib import Path

import pandas as pd
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "website_inventory.csv"
)


def load_inventory() -> pd.DataFrame:
    if not DATA_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail="Website inventory dataset was not found."
        )

    try:
        df = pd.read_csv(DATA_FILE)
    except (OSError, pd.errors.ParserError) as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to read the inventory dataset."
        ) from exc

    required_columns = [
        "batch_id",
        "product_id",
        "snapshot_date",
        "expiry_date",
        "quantity_remaining",
        "days_to_expiry",
    ]

    missing = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing:
        raise HTTPException(
            status_code=500,
            detail=f"Inventory dataset is missing columns: {missing}"
        )

    return df


@router.get("/")
def get_inventory(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
):
    df = load_inventory()

    records = df.iloc[offset:offset + limit].copy()
    records = records.astype(object).where(
        pd.notna(records), None
    )

    return {
        "total": len(df),
        "limit": limit,
        "offset": offset,
        "items": records.to_dict(orient="records"),
    }


@router.get("/expiring")
def get_expiring_inventory(
    days: int = Query(default=3, ge=0, le=365),
):
    df = load_inventory()

    df["days_to_expiry"] = pd.to_numeric(
        df["days_to_expiry"], errors="coerce"
    )

    expiring = df[
        df["days_to_expiry"].notna()
        & (df["days_to_expiry"] >= 0)
        & (df["days_to_expiry"] <= days)
    ].copy()

    expiring = expiring.astype(object).where(
        pd.notna(expiring), None
    )

    return {
        "days": days,
        "total": len(expiring),
        "items": expiring.to_dict(orient="records"),
    }
