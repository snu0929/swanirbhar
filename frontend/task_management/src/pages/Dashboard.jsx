import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FiEdit2, FiTrash, FiPlusCircle } from "react-icons/fi";
import { CircularProgress } from "@mui/material"; // A material UI spinner for loading
import { LinearProgress } from "@mui/material";

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem;
  background: linear-gradient(145deg, #f5f7fa, #c3cfe2);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #3b3b3b;
  letter-spacing: 1px;
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TaskCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TaskTitle = styled.h3`
  font-size: 1.25rem;
  color: #333;
  font-weight: bold;
  margin: 0;
`;
const PriorityBadge = styled.span`
  background-color: ${({ priority }) =>
    priority === "high"
      ? "#ff4d4d"
      : priority === "medium"
      ? "#ffcc00"
      : "#28a745"};
  color: black;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const StatusTag = styled.span`
  background-color: ${({ status }) =>
    status === "completed"
      ? "#28a745"
      : status === "in-progress"
      ? "#ffcc00"
      : "#d9534f"};
  color: black;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const TaskMeta = styled.p`
  font-size: 0.9rem;
  color: #777;
`;

const TaskActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  background: #6a0dad;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: #540b6e;
  }
`;

const IconButton = styled(Button)`
  padding: 0.5rem;
`;

const DeleteButton = styled(Button)`
  background-color: #ff4d4d;

  &:hover {
    background-color: #d9534f;
  }
`;

const AddTaskButton = styled(Button)`
  display: inline-flex;
  margin-bottom: 2rem;
  align-self: center;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4500/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        setError("Error fetching tasks. Please try again.");
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    console.log("Search Term:", searchTerm); // Log search term updates
  }, [searchTerm]);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4500/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      setError("Error deleting task. Please try again.");
      console.error("Error deleting task:", error);
    }
  };
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDueDateMessage = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInMs = due - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) return `${diffInDays} days left`;
    if (diffInDays === 0) return "Due today";
    return `Overdue by ${Math.abs(diffInDays)} days`;
  };
  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  if (loading) {
    return (
      <Loading>
        <CircularProgress />
      </Loading>
    );
  }

  return (
    <Container>
      <Heading>Dashboard</Heading>

      <AddTaskButton>
        <FiPlusCircle size={20} />
        <Link
          to="/task-form"
          style={{ color: "white", textDecoration: "none" }}
        >
          Add New Task
        </Link>
      </AddTaskButton>
      <input
        type="text"
        aria-label="Search tasks"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <h3>Your Tasks</h3>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {filteredTasks.length > 0 ? ( // Use filteredTasks here
        <TaskGrid>
          {filteredTasks.map((task) => (
            <TaskCard key={task._id}>
              <TaskHeader>
                <TaskTitle>{task.title}</TaskTitle>
              </TaskHeader>
              <TaskMeta>{truncateText(task.description, 100)}</TaskMeta>

              <TaskMeta>
                Priority:{" "}
                <PriorityBadge priority={task.priority}>
                  {task.priority}
                </PriorityBadge>
              </TaskMeta>

              <TaskMeta>
                Status:{" "}
                <StatusTag status={task.status}>{task.status}</StatusTag>
              </TaskMeta>
              <LinearProgress
                variant="determinate"
                value={
                  task.status === "completed"
                    ? 100
                    : task.status === "in-progress"
                    ? 50
                    : 0
                }
              />
              <TaskMeta>Due Date: {getDueDateMessage(task.dueDate)}</TaskMeta>

              <TaskActions>
                <IconButton>
                  <FiEdit2 size={16} />
                  <Link
                    to={`/task-form/${task._id}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                </IconButton>
                <DeleteButton onClick={() => handleDelete(task._id)}>
                  <FiTrash size={16} /> Delete
                </DeleteButton>
              </TaskActions>
            </TaskCard>
          ))}
        </TaskGrid>
      ) : (
        <p>No tasks found.</p>
      )}
    </Container>
  );
};

export default Dashboard;
