import { useEffect, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    setTodos(tasks.filter((task) => task.status === "todo"));
    setInProgress(tasks.filter((task) => task.status === "inProgress"));
    setDone(tasks.filter((task) => task.status === "done"));
  }, [tasks]);

  const statuses = ["todo", "inProgress", "done"];

  return (
    <div className="flex gap-4 flex-wrap justify-center lg:gap-16">
      {statuses.map((status) => (
        <Section
          key={status}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          done={done}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({ status, setTasks, todos, inProgress, done, tasks }) => {
  const hasDropped = useRef(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let text = "Todo";
  let bg = "bg-slate-500";
  let taskToMap = todos;

  if (status === "inProgress") {
    text = "In Progress";
    bg = "bg-blue-500";
    taskToMap = inProgress;
  } else if (status === "done") {
    text = "Done";
    bg = "bg-green-500";
    taskToMap = done;
  }

  const addItemToSection = (id) => {
    if (hasDropped.current) return;
    hasDropped.current = true;

    setTasks((prevTasks) => {
      const taskToUpdate = prevTasks.find((task) => task.id === id);

      if (taskToUpdate && taskToUpdate.status !== status) {
        toast.success(
          <>
            Status changed to <strong className="ml-1">{text}</strong>
            <span className="ml-2">
              {status === "inProgress" ? "🚀" : status === "done" ? "✅" : "📝"}
            </span>
          </>,
          {
            icon: null,
          }
        );

        const updatedTasks = prevTasks.map((task) =>
          task.id === id ? { ...task, status } : task
        );

        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      }

      return prevTasks;
    });

    setTimeout(() => {
      hasDropped.current = false;
    }, 200);
  };

  return (
    <div
      ref={drop}
      className={`w-full sm:w-64 min-h-[300px] rounded-md p-2 transition-all duration-200 ${
        isOver ? "bg-slate-200" : ""
      }`}
    >
      <Header text={text} bg={bg} count={taskToMap.length} />
      {taskToMap.map((task) => (
        <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
      ))}
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white font-semibold`}
    >
      {text}
      <div className="ml-2 bg-white h-5 w-5 text-black rounded-full flex items-center justify-center text-xs font-bold">
        {count}
      </div>
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleRemove = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    toast("Task removed", { icon: "⚡" });
  };

  return (
    <div
      ref={drag}
      className={`relative p-4 mt-4 bg-white rounded shadow-md transition-opacity ${
        isDragging ? "opacity-25" : "opacity-100"
      } cursor-grab`}
    >
      <p className="text-sm font-medium">{task.name}</p>
      <button
        className="absolute bottom-2 right-2 text-slate-400 hover:text-red-500 cursor-pointer"
        onClick={() => handleRemove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};
