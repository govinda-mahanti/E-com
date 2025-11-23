import { useLocation, useParams } from "react-router-dom";

const SearchList = () => {
 const { query } = useParams();
const location = useLocation();

const raw = location.state?.results;
const results = Array.isArray(raw) ? raw : [];


  return (
    <div className="max-w-6xl mx-auto p-4 pt-28">
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for: "{query}"
      </h2>

      {results.length === 0 ? (
        <p className="text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-medium">{product.name}</h3>
              <p className="text-gray-600">₹{product.price}</p>
              <p className="text-sm text-gray-500 mt-1">{product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchList;
