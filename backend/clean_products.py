# Import the libraries
import pandas as pd
from pathlib import Path

# Find the main project folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Define input and output paths
RAW_FILE = BASE_DIR / "datasets" / "raw" / "products.csv"
OUTPUT_DIR = BASE_DIR / "datasets" / "processed"
REPORT_DIR = BASE_DIR / "datasets" / "reports"

# Create output folders if they do not exist
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

# Load the original dataset
df = pd.read_csv(RAW_FILE, dtype={"product_id": str})

# Display the original data information
print("Original shape:", df.shape)
print("\nColumn names:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isnull().sum())

# Remove extra spaces from text columns
text_columns = ["product_id", "product_name", "category"]

for column in text_columns:
    df[column] = df[column].astype("string").str.strip()

# Convert numeric columns to numbers
numeric_columns = [
    "shelf_life_days",
    "selling_price",
    "unit_cost"
]

for column in numeric_columns:
    df[column] = pd.to_numeric(
        df[column], errors="coerce"
    )

# Remove completely identical duplicate rows
before_duplicates = len(df)
df = df.drop_duplicates()
duplicates_removed = before_duplicates - len(df)

# Identify invalid records
invalid_rows = (
    df["product_id"].isna()
    | df["product_id"].eq("")
    | df["product_name"].isna()
    | df["product_name"].eq("")
    | df["category"].isna()
    | df["category"].eq("")
    | df["shelf_life_days"].isna()
    | (df["shelf_life_days"] <= 0)
    | df["selling_price"].isna()
    | (df["selling_price"] < 0)
    | df["unit_cost"].isna()
    | (df["unit_cost"] < 0)
)

# Save invalid records for manual review
rejected = df[invalid_rows].copy()
rejected.to_csv(
    REPORT_DIR / "products_rejected.csv",
    index=False
)

# Keep only valid records
clean_df = df[~invalid_rows].copy()

# Check for repeated product IDs
duplicate_ids = clean_df["product_id"].duplicated(
    keep=False
)

# Save conflicting product IDs for review
duplicate_products = clean_df[duplicate_ids].copy()
duplicate_products.to_csv(
    REPORT_DIR / "products_duplicate_ids.csv",
    index=False
)

# Exclude repeated IDs until they are reviewed
clean_df = clean_df[~duplicate_ids].copy()

# Make shelf life an integer
clean_df["shelf_life_days"] = (
    clean_df["shelf_life_days"].astype(int)
)

# Sort by product ID
clean_df = clean_df.sort_values("product_id")

# Save the cleaned dataset
clean_df.to_csv(
    OUTPUT_DIR / "products_clean.csv",
    index=False
)

# Print the cleaning summary
print("\n--- Cleaning Summary ---")
print("Original rows:", before_duplicates)
print("Exact duplicate rows removed:", duplicates_removed)
print("Invalid rows saved for review:", len(rejected))
print("Rows with repeated product IDs:", len(duplicate_products))
print("Final clean rows:", len(clean_df))

print("\nCleaned dataset saved successfully!")