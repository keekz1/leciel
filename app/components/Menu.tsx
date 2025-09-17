"use client";

import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import "./Menu.css";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Define Menu item type
interface MenuItemData {
  id: string;
  name: string;
  price: string;
  category: string;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Hot Drinks");

  useEffect(() => {
    async function fetchMenu() {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const items: MenuItemData[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<MenuItemData, "id">;
        return { id: doc.id, ...data };
      });
      setMenuItems(items);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(items.map((item) => item.category))
      );

      setCategories(uniqueCategories);

      if (!uniqueCategories.includes("Hot Drinks") && uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
    }
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  const normalItems = filteredItems.filter(
    (item) => !item.name.trim().startsWith("+")
  );
  const addonItems = filteredItems.filter((item) =>
    item.name.trim().startsWith("+")
  );

  return (
    <section className="menu">
      {/* Heading */}
<h2 className="menu-heading">Browse our menu</h2>

      {/* Categories */}
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Selected category */}
      <div className="menu-content">
        <h3 className="selected-category-title">{selectedCategory}</h3>

        <div className="menu-items">
          {/* Normal items */}
          {normalItems.map((item) => (
            <MenuItem key={item.id} name={item.name} price={item.price} />
          ))}

          {/* Add-ons */}
          {addonItems.length > 0 && (
            <div className="addons-section">
              <h4 className="addons-title">Perfect Add-ons</h4>
              {addonItems.map((item) => (
                <MenuItem key={item.id} name={item.name} price={item.price} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
