import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const CreateTask = ({ tasks, setTasks }) => {
  const [taskName, setTaskName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.length < 3)
      return toast.error("Task must be at least 3 characters");
    if (taskName.length > 100)
      return toast.error("Task must not exceed 100 characters");

    const newTask = {
      id: uuidv4(),
      name: taskName,
      status: "todo",
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    toast.success("Task created");
    setTaskName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="border-2 border-slate-400 rounded-md mr-4 h-12 w-64 px-1"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter task name"
      />
      <button className="bg-cyan-500 rounded-md px-4 h-12 text-white cursor-pointer">
        Create
      </button>
    </form>
  );
};

export default CreateTask;
