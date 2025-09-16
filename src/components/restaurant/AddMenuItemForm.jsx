import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddMenuItemForm = ({ restaurantId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    isAvailable: true,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Main Course",
    "Dessert",
    "Snacks",
    "Beverages",
    "Appetizers",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(""); // clear link if file is chosen
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      return toast.error("Please fill all required fields");
    }

    if (!image && !imageUrl.trim()) {
      return toast.error("Please upload an image or provide a link");
    }
    console.log(formData);



    const data = new FormData();
    data.append("restaurantId", restaurantId);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("isAvailable", formData.isAvailable);

    if (image) {
      data.append("image", image);
    } else if (imageUrl.trim()) {
      data.append("imageUrl", imageUrl.trim());
    }
    console.log(data);


    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/restaurants/menu/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      onSuccess && onSuccess(res.data.menuItem);
      onClose && onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add menu item");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Add Menu Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            rows="3"
            required
          />

          {/* Price */}
          <input
            type="tel"
            name="price"
            placeholder="Price"
            maxLength={4}
            inputMode="numeric"
            value={formData.price}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            required
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Availability */}
          <label className="flex items-center gap-2 text-gray-700 ml-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>

          {/* Image Upload */}
          <div>
            <label
              className="block text-base mt-4 text-left text-gray-700"
              htmlFor="image"
            >
              Image (Upload or Link)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            />
          </div>


          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemForm;
