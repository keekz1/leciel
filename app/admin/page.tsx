"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

interface MenuItem {
  id?: string;
  name: string;
  price: string;
  category: string;
}

interface Category {
  name: string;
}

export default function AdminPage() {
  // AUTH
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "12345"; // 🔒 simple admin login

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (
      loginForm.username === ADMIN_USERNAME &&
      loginForm.password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid username or password");
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setLoginForm({ username: "", password: "" });
  }

  // MENU + CATEGORIES
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newItemForm, setNewItemForm] = useState<Omit<MenuItem, "id">>({
    name: "",
    price: "",
    category: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<Omit<MenuItem, "id">>({
    name: "",
    price: "",
    category: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState("");

  async function fetchMenu() {
    const querySnapshot = await getDocs(collection(db, "menu"));
    const items = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<MenuItem, "id">;
      return { id: docSnap.id, ...data };
    });
    setMenu(items);

    const uniqueCategories = Array.from(
      new Set(items.map((item) => item.category))
    ).map((name) => ({ name }));
    setCategories(uniqueCategories);
  }

  useEffect(() => {
    if (isAuthenticated) fetchMenu();
  }, [isAuthenticated]);

  async function addItem() {
    if (!newItemForm.name || !newItemForm.price || !newItemForm.category) return;
    await addDoc(collection(db, "menu"), newItemForm);
    setNewItemForm({ name: "", price: "", category: "" });
    fetchMenu();
  }

  async function updateItem(docId: string) {
    if (!docId) return;
    const itemRef = doc(db, "menu", docId);
    await updateDoc(itemRef, editingForm);
    setEditingId(null);
    setEditingForm({ name: "", price: "", category: "" });
    fetchMenu();
  }

  async function deleteItem(docId: string) {
    if (!docId) return;
    await deleteDoc(doc(db, "menu", docId));
    fetchMenu();
  }

  function addCategory() {
    if (!newCategory) return;
    setCategories([...categories, { name: newCategory }]);
    setNewCategory("");
  }

  async function deleteCategory() {
    if (!categoryToDelete) return;
    const confirmDelete = confirm(
      `Are you sure you want to delete category "${categoryToDelete}" and all its items?`
    );
    if (!confirmDelete) return;

    const q = query(collection(db, "menu"), where("category", "==", categoryToDelete));
    const querySnapshot = await getDocs(q);
    const batchDeletes = querySnapshot.docs.map((docItem) =>
      deleteDoc(doc(db, "menu", docItem.id))
    );
    await Promise.all(batchDeletes);

    fetchMenu();
    setCategoryToDelete("");
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
            className="w-full p-2 border rounded-md mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="w-full p-2 border rounded-md mb-3"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </main>
    );
  }

  // ADMIN DASHBOARD
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Logout
          </button>
        </div>

        {/* CATEGORY MANAGEMENT */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              placeholder="New Category"
              aria-label="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={addCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <select
              aria-label="Select Category to Delete"
              value={categoryToDelete}
              onChange={(e) => setCategoryToDelete(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            >
              <option value="">Select Category to Delete</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={deleteCategory}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                {cat.name}
              </span>
            ))}
          </div>
        </section>

        {/* ADD NEW MENU ITEM */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              placeholder="Name"
              aria-label="Item Name"
              value={newItemForm.name}
              onChange={(e) =>
                setNewItemForm({ ...newItemForm, name: e.target.value })
              }
              className="p-2 border rounded-md"
            />
            <input
              placeholder="Price"
              aria-label="Item Price"
              value={newItemForm.price}
              onChange={(e) =>
                setNewItemForm({ ...newItemForm, price: e.target.value })
              }
              className="p-2 border rounded-md"
            />
            <select
              aria-label="Select Category"
              value={newItemForm.category}
              onChange={(e) =>
                setNewItemForm({ ...newItemForm, category: e.target.value })
              }
              className="p-2 border rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Item
            </button>
          </div>
        </section>

        {/* MENU ITEMS */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
          <div className="space-y-3">
            {menu.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 border rounded-lg">
                {editingId === item.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
                    <input
                      aria-label="Edit Name"
                      value={editingForm.name}
                      onChange={(e) =>
                        setEditingForm({ ...editingForm, name: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    />
                    <input
                      aria-label="Edit Price"
                      value={editingForm.price}
                      onChange={(e) =>
                        setEditingForm({ ...editingForm, price: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    />
                    <select
                      aria-label="Edit Category"
                      value={editingForm.category}
                      onChange={(e) =>
                        setEditingForm({ ...editingForm, category: e.target.value })
                      }
                      className="p-2 border rounded-md"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateItem(item.id!)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="flex-1">
                      <strong>{item.name}</strong> - {item.price} ({item.category})
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteItem(item.id!)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(item.id!);
                          setEditingForm({ name: item.name, price: item.price, category: item.category });
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
