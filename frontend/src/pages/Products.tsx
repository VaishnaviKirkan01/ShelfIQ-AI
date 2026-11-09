
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/products/";

interface Product {
  product_id: number;
  product_name: string;
  category: string;
  shelf_life_days: number;
  selling_price: number;
  unit_cost: number;
}

interface ProductForm {
  product_name: string;
  category: string;
  shelf_life_days: number;
  selling_price: number;
  unit_cost: number;
}

const emptyForm: ProductForm = {
  product_name: "",
  category: "",
  shelf_life_days: 1,
  selling_price: 0,
  unit_cost: 0,
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load products from SQL Server through FastAPI
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load products.");
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle form input changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "product_name" || name === "category"
          ? value
          : Number(value),
    }));
  };

  // Open form for adding a product
  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowForm(true);
  };

  // Open form with existing product details
  const openEditForm = (product: Product) => {
    setEditingId(product.product_id);

    setForm({
      product_name: product.product_name,
      category: product.category,
      shelf_life_days: product.shelf_life_days,
      selling_price: product.selling_price,
      unit_cost: product.unit_cost,
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  // Add or update a product
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}${editingId}` : API_URL,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to save product."
        );
      }

      setMessage(
        isEditing
          ? "Product updated successfully."
          : "Product added successfully."
      );

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  // Delete a product
  const handleDelete = async (productId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to delete product."
        );
      }

      setMessage("Product deleted successfully.");
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  // Search products by name or category
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.product_name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="page-content">
      <div className="welcome">
        <div>
          <span className="kicker">PRODUCT MANAGEMENT</span>
          <h1>Manage your <em>Products</em></h1>
          <p>
            View and manage the products available in your food inventory.
          </p>
        </div>

        <button className="button button-green" onClick={openAddForm}>
          + Add Product
        </button>
      </div>

      {message && (
        <div className="management-message">{message}</div>
      )}

      {error && (
        <div className="management-message management-error">
          {error}
        </div>
      )}

      <div className="management-actions">
        <label className="search-input">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search products or categories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <button
          className="button button-outline"
          onClick={loadProducts}
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <section className="management-card">
          <h3>
            {editingId !== null ? "Edit Product" : "Add New Product"}
          </h3>

          <p>Enter the product details below.</p>

          <form
            className="product-form-grid"
            onSubmit={handleSubmit}
          >
            <label>
              Product Name
              <input
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Category
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Shelf Life (Days)
              <input
                type="number"
                name="shelf_life_days"
                min="1"
                value={form.shelf_life_days}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Selling Price (₹)
              <input
                type="number"
                name="selling_price"
                min="0"
                step="0.01"
                value={form.selling_price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Unit Cost (₹)
              <input
                type="number"
                name="unit_cost"
                min="0"
                step="0.01"
                value={form.unit_cost}
                onChange={handleChange}
                required
              />
            </label>

            <div className="management-actions">
              <button className="button button-green" type="submit">
                {editingId !== null ? "Save Changes" : "Add Product"}
              </button>

              <button
                className="button button-outline"
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="management-card">
        <h3>Product Catalogue</h3>
        <p>
          {products.length} products retrieved from your database.
        </p>

        {loading ? (
          <div className="empty-state">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <strong>No products found</strong>
            <p>Try another search or add a product.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>SHELF LIFE</th>
                  <th>SELLING PRICE</th>
                  <th>UNIT COST</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.product_id}>
                    <td>
                      <div className="product-name">
                        <span className="product-thumb">🥬</span>
                        <strong>{product.product_name}</strong>
                      </div>
                    </td>

                    <td>{product.category}</td>
                    <td>{product.shelf_life_days} days</td>
                    <td>₹{product.selling_price}</td>
                    <td>₹{product.unit_cost}</td>

                    <td>
                      <div className="management-actions">
                        <button
                          className="button button-outline"
                          onClick={() => openEditForm(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="button button-outline"
                          onClick={() =>
                            handleDelete(product.product_id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;
