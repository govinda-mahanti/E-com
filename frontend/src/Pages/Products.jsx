import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import FilterBar from "../Components/FilterBar";

function Products() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    priceRange: [0, 70000],
    sortOrder: "featured",
    categories: [],
    colors: [],
    materials: [],
    gender: [],
    ageGroup: [],
  });

  const filterOptions = {
    categories: [], // ← You can auto-generate categories from backend if needed
    colors: [],
    materials: [],
    gender: [],
    ageGroups: [],
  };

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://ecom-backend-33s4.onrender.com/api/products");
        const data = await res.json();
        console.log("Fetched products:", data);
        setProducts(data);
      } catch (error) {
        console.error("API Fetch Error:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // --------------------------
  // 💛 Favourite toggle
  // --------------------------
  const toggleFavorite = (e, product) => {
    e.stopPropagation();
    const isFav = favorites.some((fav) => fav._id === product._id);

    if (isFav) {
      setFavorites(favorites.filter((fav) => fav._id !== product._id));
      showNotification("Removed from favourites");
    } else {
      setFavorites([...favorites, product]);
      showNotification("Added to favourites ❤️");
    }
  };

  const isFavorited = (id) => favorites.some((fav) => fav._id === id);

  const addToCart = (e, product) => {
    e.stopPropagation();
    showNotification(`${product.name.substring(0, 30)}... added to cart! 🛒`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2500);
  };

  // --------------------------
  // 🔍 Filtering Logic
  // --------------------------
  const getFilteredProducts = () => {
    let filtered = [...products];

    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    // (Other filters available only if added to products)

    switch (filters.sortOrder) {
      case "priceLowHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "nameAZ":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading products...</div>;
  }

  return (
    <div className="min-h-screen overflow-visible">
      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={(type, value) =>
          setFilters((prev) => ({ ...prev, [type]: value }))
        }
        clearFilters={() =>
          setFilters({
            priceRange: [0, 70000],
            sortOrder: "featured",
            categories: [],
            colors: [],
            materials: [],
            gender: [],
            ageGroup: [],
          })
        }
        filteredProductsCount={filteredProducts.length}
        totalProductsCount={products.length}
        activeFilterCount={0}
        filterOptions={filterOptions}
      />

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 pt-24 mt-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 mb-4">
              No products found matching your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all cursor-pointer relative"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <button
                  onClick={(e) => toggleFavorite(e, product)}
                  className="absolute top-3 right-3 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-110 transition-all"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorited(product._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                <div className="relative w-full aspect-square">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-xs text-blue-600 font-medium mb-2">
                    {product.category}
                  </p>

                  <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 flex-1">
                    {product.name}
                  </h3>

                  <div className="mt-auto space-y-2">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={(e) => addToCart(e, product)}
                      className="w-full py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>

                    <div className="text-xs text-center text-gray-600">
                      ⭐ {product.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
