import { useState } from "react";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";
// import { v4 } from "uuid";
import { useEffect } from "react";
import Title from "./components/Title";
import { supabase } from "./utils/supabase";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const updateTasks = async () => {
      const { data, error } = await supabase.from("todos").upsert(tasks);
      if (error) {
        console.error("Error updating tasks", error.message);
        return;
      }
      console.log("Tasks updated", data);
    };
    updateTasks();
  }, [tasks]);

  // initialize supabase
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from("todos").select("*");
      if (error) {
        console.error("Error fetching todos", error.message);
        return;
      }
      setTasks(data);
    };
    fetchTodos();
  }, []);

  function onTaskClick(taskId) {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          iscomplete: !task.iscomplete,
        };
      }
      return task;
    });
    setTasks(newTasks);
  }

  function onDeleteTaskClick(taskId) {
    const deleteTask = async () => {
      const { data, error } = await supabase
        .from("todos")
        .delete()
        .eq("id", taskId);
      if (error) {
        console.error("Error deleting task", error.message);
        return;
      }
      console.log("Tasks deleted", data);
    };
    deleteTask();
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  }

  function onAddTaskSubmit(title, description) {
    const newTask = {
      // id: v4(),
      id: tasks.length + 1,
      title,
      description,
      iscomplete: false,
    };
    setTasks([...tasks, newTask]);
  }

  return (
    <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
      <div className="w-[500px] space-y-4">
        <Title>Task Manager!</Title>
        <AddTask onAddTaskSubmit={onAddTaskSubmit} />
        <Tasks
          tasks={tasks}
          onTaskClick={onTaskClick}
          onDeleteTaskClick={onDeleteTaskClick}
        />
      </div>
    </div>
  );
}

export default App;
