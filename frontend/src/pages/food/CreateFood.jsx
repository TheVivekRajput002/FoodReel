import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateFoodPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      setMessage("Please upload a video");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("video", video);


      const response = await axios.post("http://localhost:3000/api/food", formData, { withCredentials: true })
      console.log(response)

      if (response.ok) {
        setMessage("Food item created successfully ✅");
        setName("");
        setDescription("");
        setVideo(null);
        navigate("/")
      } else {
        setMessage(response.message || "Failed to create food item");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded-xl shadow-md w-[400px]"
      >
        <h1 className="text-2xl font-semibold mb-6">
          Create Food Item
        </h1>

        <input
          type="text"
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          className="mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Create Food"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm">{message}</p>
        )}
      </form>
    </div>
  );
}