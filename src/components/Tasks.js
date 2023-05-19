import Task from "./Task";

const Tasks = ({ tasks, onToggle, onDelete }) => {
    return (
        <>
            {tasks.map((task) => (
                <Task
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onToggle={onToggle}
                />
            ))}
        </>
    );
};

export default Tasks;
