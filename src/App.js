import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import About from "./components/About";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Tasks from "./components/Tasks";

function App() {
    const [showAddTask, setShowAddTask] = useState(false);

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks();
            setTasks(tasksFromServer);
        };

        getTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await fetch("http://localhost:5000/tasks/");

        const data = await res.json();
        return data;
    };

    const fetchTask = async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}/`);

        const data = await res.json();
        return data;
    };

    const deleteTask = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}/`, {
            method: "DELETE",
        });

        setTasks(tasks.filter((task) => task.id !== id));
    };

    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id);
        const updateTask = {
            ...taskToToggle,
            reminder: !taskToToggle.reminder,
        };

        const res = await fetch(`http://localhost:5000/tasks/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateTask),
        });

        const data = await res.json();

        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, reminder: data.reminder } : task
            )
        );
    };

    const addTask = async (task) => {
        const res = await fetch("http://localhost:5000/tasks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });

        const data = await res.json();
        setTasks([...tasks, data]);
    };

    return (
        <div className="container">
            <Header
                showAdd={showAddTask}
                onAdd={() => {
                    setShowAddTask(!showAddTask);
                }}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            {showAddTask && <AddTask onAddTask={addTask} />}
                            {tasks.length > 0 ? (
                                <Tasks
                                    tasks={tasks}
                                    onDelete={deleteTask}
                                    onToggle={toggleReminder}
                                />
                            ) : (
                                <h3
                                    className="task"
                                    style={{ cursor: "initial" }}
                                >
                                    Task list - Empty !
                                </h3>
                            )}
                        </>
                    }
                />
                <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
