"use client";

import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import "./Menu.css";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const categories = [
  'All', 'Cold Drinks', 'Hot Drinks', 'Alcohol', 'Crackers',
  'Shisha', 'Desserts', 'Sajj', 'Sandwiches', 'Plates'
];

export default function Menu() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchMenu() {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
    }
    fetchMenu();
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);

  return (
    <section className="menu">
      <div className="categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-content">
        <div className="menu-items">
          {filteredItems.map(item => (
            <MenuItem key={item.id} name={item.name} price={item.price} />
          ))}
        </div>
      </div>
    </section>
  );
}
