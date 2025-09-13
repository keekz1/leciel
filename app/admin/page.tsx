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
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const ADMIN_USERNAME = "waelbouaziz";
  const ADMIN_PASSWORD = "wael90@leciel@2025";

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    if (
      loginForm.username === ADMIN_USERNAME &&
      loginForm.password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 7) {
        setIsLocked(true);
        setCountdown(20);

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setIsLocked(false);
              setAttempts(0);
              return 20;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(`Invalid username or password. Attempt ${newAttempts}/7`);
      }
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
    if (!newItemForm.name || !newItemForm.price || !newItemForm.category)
      return;
    await addDoc(collection(db, "menu"), newItemForm);
    setNewItemForm({ name: "", price: "", category: "" });
    fetchMenu();
  }

  async function updateItem(docId: string | undefined) {
    if (!docId) {
      console.error("Cannot update item: docId is undefined");
      return;
    }

    // Ensure docId is a string
    const itemRef = doc(db, "menu", String(docId));

    const updatedData = {
      name: String(editingForm.name),
      price: String(editingForm.price),
      category: String(editingForm.category),
    };

    try {
      await updateDoc(itemRef, updatedData);
      setEditingId(null);
      setEditingForm({ name: "", price: "", category: "" });
      fetchMenu();
    } catch (error) {
      console.error("Error updating item:", error);
    }
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

    const q = query(
      collection(db, "menu"),
      where("category", "==", categoryToDelete)
    );
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
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm border border-gray-300"
        >
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Admin Login
          </h2>

          {isLocked && (
            <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-center">
              Account locked. Try again in {countdown} seconds.
            </div>
          )}

          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md mb-3 text-gray-800 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLocked}
          />

          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md mb-4 text-gray-800 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLocked}
          />

          <button
            type="submit"
            disabled={isLocked}
            className={`w-full text-white p-3 rounded-md font-medium ${
              isLocked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLocked ? `Locked (${countdown}s)` : "Login"}
          </button>
        </form>
      </main>
    );
  }

  // ADMIN DASHBOARD
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white rounded-xl shadow border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 font-medium"
          >
            Logout
          </button>
        </div>

        {/* CATEGORY MANAGEMENT */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Manage Categories
          </h2>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <label htmlFor="newCategory" className="sr-only">
              New Category
            </label>
            <input
              id="newCategory"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md text-gray-800 bg-white"
            />
            <button
              onClick={addCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Add
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <label htmlFor="categoryToDelete" className="sr-only">
              Select Category to Delete
            </label>
            <select
              id="categoryToDelete"
              value={categoryToDelete}
              onChange={(e) => setCategoryToDelete(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md text-gray-800 bg-white"
            >
              <option value="">Select Category to Delete</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={deleteCategory}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
            >
              Delete
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-800 font-medium"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </section>

        {/* ADD NEW MENU ITEM */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Add New Menu Item
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <label htmlFor="newItemName" className="sr-only">
              Item Name
            </label>
            <input
              id="newItemName"
              placeholder="Name"
              value={newItemForm.name}
              onChange={(e) =>
                setNewItemForm({ ...newItemForm, name: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-md text-gray-800 bg-white"
            />

            <label htmlFor="newItemPrice" className="sr-only">
              Item Price
            </label>
            <input
              id="newItemPrice"
              placeholder="Price"
              value={newItemForm.price}
              onChange={(e) =>
                setNewItemForm({ ...newItemForm, price: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-md text-gray-800 bg-white"
            />

            <label htmlFor="newItemCategory" className="sr-only">
              Select Category
            </label>
            <select
              id="newItemCategory"
              value={newItemForm.category}
              onChange={(e) =>
                setNewItemForm({ ...newItemForm, category: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-md text-gray-800 bg-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
            >
              Add Item
            </button>
          </div>
        </section>

        {/* MENU ITEMS */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Menu Items
          </h2>
          <div className="space-y-3">
            {menu.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 border border-gray-300 rounded-lg bg-gray-50"
              >
                {editingId === item.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
                    <label
                      htmlFor={`editName-${item.id}`}
                      className="sr-only"
                    >
                      Edit Name
                    </label>
                    <input
                      id={`editName-${item.id}`}
                      value={editingForm.name}
                      onChange={(e) =>
                        setEditingForm({ ...editingForm, name: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                    />

                    <label
                      htmlFor={`editPrice-${item.id}`}
                      className="sr-only"
                    >
                      Edit Price
                    </label>
                    <input
                      id={`editPrice-${item.id}`}
                      value={editingForm.price}
                      onChange={(e) =>
                        setEditingForm({ ...editingForm, price: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                    />

                    <label
                      htmlFor={`editCategory-${item.id}`}
                      className="sr-only"
                    >
                      Edit Category
                    </label>
                    <select
                      id={`editCategory-${item.id}`}
                      value={editingForm.category}
                      onChange={(e) =>
                        setEditingForm({
                          ...editingForm,
                          category: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (item.id) updateItem(item.id);
                        }}
                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 font-medium"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-gray-800">
                      <strong className="font-semibold">{item.name}</strong> - {item.price} (
                      <span className="text-blue-700">{item.category}</span>)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteItem(item.id!)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 font-medium"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(item.id!);
                          setEditingForm({
                            name: item.name,
                            price: item.price,
                            category: item.category,
                          });
                        }}
                        className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 font-medium"
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