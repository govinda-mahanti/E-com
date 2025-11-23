import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Heart,
  User,
  ShoppingCart,
  ChevronDown,
  MapPin,
  Home as HomeIcon,
  X
} from "lucide-react";


const Navbar = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  const q = search.trim();
  if (!q) return;

  try {
    const res = await fetch("http://localhost:5000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.log("SERVER RAW RESPONSE:", text);
      throw new Error("Server returned non-JSON HTML");
    }

    const data = await res.json();

    navigate(`/searchlist/${encodeURIComponent(q)}`, {
      state: { results: data },
    });
  } catch (error) {
    console.error("Search API Error:", error);
  }
};




  return (
    <>
      {/* Top header */}
      <motion.header
     
        className="w-full bg-[#0071DC] text-white flex items-center px-4 md:px-8 py-3 md:py-4 justify-between"
      >
        {/* left - mobile menu button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-white/10"
            aria-label="open menu"
          >
            <Menu size={22} />
          </button>

          {/* logo - desktop */}
          <div className="hidden md:flex items-center min-w-[160px]">
            <p className="bold text-3xl">E commerce</p>
          </div>

          {/* logo - mobile small */}
          <div className="md:hidden flex items-center">
            <p className="bold text-3xl">E</p>
          </div>
        </div>

        {/* search */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white rounded-full px-2 py-1 md:py-2 w-full md:w-2/4 lg:w-1/2 mx-4 md:mx-8"
        >
          <input
            type="text"
            placeholder="Search at virtualkart"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-black placeholder-gray-400 text-sm md:text-base px-3 outline-none bg-transparent"
          />
          <button className="bg-[#0071DC] p-2 rounded-full text-white ml-2" aria-label="search">
            <Search size={16} />
          </button>
        </form>

        {/* right icons - visible on md+ */}
        <div className="hidden md:flex items-center gap-6">
          <button className="flex items-center gap-2 hover:opacity-90"
          
           onClick={()=>{navigate("./favourites")}}
          >
            <Heart size={18} />
            <div className="text-left leading-tight">
              <p className="text-xs">Reorder</p>
              <p className="text-sm font-semibold">My items</p>
            </div>
          </button>

          <button className="flex items-center gap-2 hover:opacity-90"
           onClick={()=>{navigate("./profile")}}
          >          
            <User size={20} />
            <div className="text-left leading-tight">
              <p className="text-xs">Sign in</p>
              <p className="text-sm font-semibold">Account</p>
            </div>
          </button>

          <button className="relative flex items-center gap-2 hover:opacity-90"
           onClick={()=>{navigate("./cart")}}
          >
            <span className="absolute -top-1 -right-3 bg-yellow-400 text-black rounded-full text-xs px-1">0</span>
            <ShoppingCart size={22} />
            <p className="text-sm font-semibold">$000</p>
          </button>
        </div>

        {/* cart icon for mobile */}
        <button className="md:hidden relative ml-2">
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-black rounded-full text-xs px-1">0</span>
          <ShoppingCart size={22} />
        </button>
      </motion.header>

      {/* Secondary navbar */}
      <nav className="w-full bg-[#0071DC] text-white border-t border-white text-sm font-medium h-12 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <img
              src="https://i5.walmartimages.com/dfw/4ff9c6c9-ad46/k2-_0a671c38-d307-447c-835e-7904ab143c26.v1.png"
              className="h-7"
              alt=""
            />
            <p className="font-medium">How do you want your items?</p>
            <ChevronDown size={14} />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <MapPin size={14} />
            <p>Scramento 95829</p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <HomeIcon size={14} />
            <p>Scramento Supercenter</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/products" className={({isActive}) => isActive ? 'underline' : ''}>Deals</NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? 'underline' : ''}>Grocery & Essentials</NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? 'underline' : ''}>Easter</NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? 'underline' : ''}>Walmart Style</NavLink>
          <NavLink to="/productlist" className={({isActive}) => isActive ? 'underline' : ''}>Baby Days</NavLink>
        </div>
      </nav>

      {/* Mobile sidebar (slide-in from left) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 p-4 overflow-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <img src="/img/logo2.png" className="h-10" alt="logo" />
                <button onClick={() => setSidebarOpen(false)} className="p-2">
                  <X />
                </button>
              </div>

              <div className="space-y-3">
                <Link to="/profile" onClick={() => setSidebarOpen(false)} className="block py-2">Profile</Link>
                <Link to="/" onClick={() => setSidebarOpen(false)} className="block py-2">Home</Link>
                <Link to="/productlist" onClick={() => setSidebarOpen(false)} className="block py-2">Products</Link>
                <Link to="/cart" onClick={() => setSidebarOpen(false)} className="block py-2">Cart</Link>
                <Link to="/favourites" onClick={() => setSidebarOpen(false)} className="block py-2">Wishlist</Link>
                <hr className="my-2" />
                <Link to="/products" onClick={() => setSidebarOpen(false)} className="block py-2">Deals</Link>
                <Link to="/products" onClick={() => setSidebarOpen(false)} className="block py-2">Grocery & Essentials</Link>
                <Link to="/products" onClick={() => setSidebarOpen(false)} className="block py-2">Easter</Link>
                <Link to="/products" onClick={() => setSidebarOpen(false)} className="block py-2">Walmart Style</Link>
                <Link to="/productlist" onClick={() => setSidebarOpen(false)} className="block py-2">Baby Days</Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};


export default Navbar;