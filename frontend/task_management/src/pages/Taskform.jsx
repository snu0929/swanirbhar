import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 500px;
  margin: 1rem auto;
  padding: 2rem;
  background-color: #e8f6f3; /* Soft Mint */
  border-radius: 15px; /* Slightly more rounded corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Enhanced shadow */
`;

const Heading = styled.h2`
  color: #6a0d91; /* Royal Purple */
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Increased gap for better spacing */
`;

const Label = styled.label`
  font-size: 1rem;
  color: #2e3a4a; /* Dark Slate */
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Increased gap for better spacing */
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e6e6fa; /* Light Lavender */
  border-radius: 10px; /* More rounded corners */
  background-color: #fffff0; /* Ivory */
  color: #2e3a4a; /* Dark Slate */
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #007bff; /* Electric Blue */
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5); /* Electric Blue shadow */
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e6e6fa; /* Light Lavender */
  border-radius: 10px; /* More rounded corners */
  background-color: #fffff0; /* Ivory */
  color: #2e3a4a; /* Dark Slate */
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #007bff; /* Electric Blue */
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5); /* Electric Blue shadow */
    outline: none;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e6e6fa; /* Light Lavender */
  border-radius: 10px; /* More rounded corners */
  background-color: #fffff0; /* Ivory */
  color: #2e3a4a; /* Dark Slate */
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #007bff; /* Electric Blue */
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5); /* Electric Blue shadow */
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #6a0d91; /* Electric Blue */
  color: #ffffff;
  padding: 0.75rem;
  border: none;
  border-radius: 10px; /* More rounded corners */
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #4a0866; /* Darker Electric Blue */
    transform: translateY(-2px); /* Slight lift effect */
  }

  &:active {
    background-color: #004494; /* Even darker Electric Blue */
    transform: translateY(0); /* Return to normal */
  }
`;

const ErrorMessage = styled.p`
  color: #dc143c; /* Crimson Red */
  text-align: center;
`;

const formatDate = (dateString) => {
  // Convert date string to 'yyyy-MM-dd' format
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0-based
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const TaskForm = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the task ID from the URL

  useEffect(() => {
    if (id) {
      // Fetch the task data if an ID is present
      const fetchTask = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:4500/tasks/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const task = response.data;
          setTaskData({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: formatDate(task.dueDate), // Format the date
          });
          setIsEditing(true);
        } catch (error) {
          console.error("Error fetching task:", error);
          setError("Failed to fetch task");
        }
      };

      fetchTask();
    }
  }, [id]);

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        // Update the existing task
        const response = await axios.put(
          `http://localhost:4500/tasks/${id}`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          navigate("/dashboard"); // Navigate back to the dashboard after task update
        }
      } else {
        // Create a new task
        const response = await axios.post(
          "http://localhost:4500/tasks/create",
          taskData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 201) {
          navigate("/dashboard"); // Navigate back to the dashboard after task creation
        }
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      setError(isEditing ? "Failed to update task" : "Failed to create task");
    }
  };

  return (
    <Container>
      <Heading>{isEditing ? "Edit Task" : "Create New Task"}</Heading>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Label>
          Title:
          <Input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
            aria-label="Task Title"
          />
        </Label>
        <Label>
          Description:
          <TextArea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            required
            aria-label="Task Description"
          />
        </Label>
        <Label>
          Status:
          <Select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            aria-label="Task Status"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </Label>
        <Label>
          Priority:
          <Select
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            aria-label="Task Priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </Label>
        <Label>
          Due Date:
          <Input
            type="date"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleChange}
            required
            aria-label="Task Due Date"
          />
        </Label>
        <Button type="submit">
          {isEditing ? "Update Task" : "Create Task"}
        </Button>
      </Form>
    </Container>
  );
};

export default TaskForm;
