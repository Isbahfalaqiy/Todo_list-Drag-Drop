import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CreateTask from "./assets/components/CreateTask";
import ListTasks from "./assets/components/ListTasks";
import Login from "./assets/components/Login";
import Register from "./assets/components/Register";
import { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [tasks, setTasks] = useState([]);
  const [auth, setAuth] = useState(false);

  // Periksa status login setiap kali aplikasi dimuat
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks") || "[]";
    const parsedTasks = JSON.parse(storedTasks);
    setTasks(parsedTasks);

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setAuth(isLoggedIn); // Periksa apakah pengguna sudah login
  }, []);

  const handleLogin = () => {
    setAuth(true); // Perbarui status login ketika berhasil login
    localStorage.setItem("isLoggedIn", "true"); // Simpan status login ke localStorage
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setAuth(false); // Logout dan perbarui status login
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <Router>
        <div className="bg-gray-50 w-screen h-screen flex flex-col items-center pt-12 gap-16">
          {auth && (
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition duration-200 cursor-pointer"
            >
              Logout
            </button>
          )}

          <Routes>
            <Route
              path="/"
              element={
                auth ? (
                  <>
                    <CreateTask tasks={tasks} setTasks={setTasks} />
                    <ListTasks tasks={tasks} setTasks={setTasks} />
                  </>
                ) : (
                  <Navigate to="/login" /> // Arahkan ke login jika belum login
                )
              }
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to={auth ? "/" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;
