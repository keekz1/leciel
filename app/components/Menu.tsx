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
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchMenu() {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const items: MenuItemData[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<MenuItemData, "id">;
        return { id: doc.id, ...data };
      });
      setMenuItems(items);

      // Extract unique categories from menu items
      const uniqueCategories = Array.from(
        new Set(items.map((item) => item.category))
      );
      setCategories(["All", ...uniqueCategories]);
    }
    fetchMenu();
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="menu">
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

      <div className="menu-content">
        <div className="menu-items">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} name={item.name} price={item.price} />
          ))}
        </div>
      </div>
    </section>
  );
}
