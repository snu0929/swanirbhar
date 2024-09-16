import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  background-color: #e8f6f3; /* Soft Mint */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;
`;

const Header = styled.h2`
  color: #6a0d91; /* Royal Purple */
  text-align: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  color: #007bff; /* Electric Blue */
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #d6d6d6; /* Warm Gray */
  &:last-child {
    border-bottom: none;
  }
`;

const Highlight = styled.span`
  color: #6a0d91; /* Royal Purple */
  font-weight: bold;
`;

const Note = styled.p`
  color: #d5a6a5; /* Dusty Rose */
  font-style: italic;
  margin-top: 1rem;
  text-align: center;
`;

const AISuggestions = () => {
  const [tasks, setTasks] = useState([]);
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(true);

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
        console.log("Fetched tasks:", response.data); // Debug log
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:4500/tasks/ai-suggestions",
          { tasks: tasks.map((task) => task.title) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuggestions(response.data.suggestions || ""); // Ensure suggestions are set
        setLoading(false);
        console.log("Fetched suggestions:", response.data); // Debug log
      } catch (error) {
        console.error("Error fetching AI suggestions:", error);
        setLoading(false);
      }
    };

    if (tasks.length > 0) {
      fetchSuggestions();
    }
  }, [tasks]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>AI Suggestions</Header>
      <Section>
        <SectionTitle>Prioritization Guide</SectionTitle>
        <p>
          It’s impossible to prioritize your tasks without more context. Here’s
          a breakdown of how to do it yourself, with questions to help you
          decide:
        </p>
        <List>
          <ListItem>
            <Highlight>1. Understanding Urgency and Importance:</Highlight>
            <ul>
              <li>
                <Highlight>Urgent:</Highlight> Must be done immediately or soon
                to avoid negative consequences.
              </li>
              <li>
                <Highlight>Important:</Highlight> Has a significant impact on
                your goals or the success of your projects.
              </li>
            </ul>
          </ListItem>
          <ListItem>
            <Highlight>2. Prioritization Matrix:</Highlight>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <Highlight>Important</Highlight>
                  </th>
                  <th>
                    <Highlight>Not Important</Highlight>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Highlight>Urgent</Highlight>
                  </td>
                  <td>Do Now</td>
                  <td>Delegate or postpone</td>
                </tr>
                <tr>
                  <td>
                    <Highlight>Not Urgent</Highlight>
                  </td>
                  <td>Schedule</td>
                  <td>Eliminate or delay</td>
                </tr>
              </tbody>
            </table>
          </ListItem>
          <ListItem>
            <Highlight>3. Applying the Matrix to Your Tasks:</Highlight>
            <ul>
              <li>
                <Highlight>Urgent and Important:</Highlight> Fix production bug,
                Respond to emails.
              </li>
              <li>
                <Highlight>Important but Not Urgent:</Highlight> Prepare
                presentation, Update project documentation, Team meeting, etc.
              </li>
              <li>
                <Highlight>Not Important But Urgent:</Highlight> Testing time.
              </li>
              <li>
                <Highlight>Not Important and Not Urgent:</Highlight> Learn
                NodeJS, Learn React, etc.
              </li>
            </ul>
          </ListItem>
          <ListItem>
            <Highlight>4. Additional Considerations:</Highlight>
            <ul>
              <li>
                Dependencies, Skills, Time Availability, Project Deadlines
              </li>
            </ul>
          </ListItem>
          <ListItem>
            <Highlight>5. Using a Task Management System:</Highlight>
            <ul>
              <li>
                Use tools like Trello, Asana, or Jira to help you visualize your
                tasks and prioritize them.
              </li>
            </ul>
          </ListItem>
        </List>
      </Section>
      <Note>
        By applying this approach, you'll be able to effectively manage your
        workload and ensure that the most important tasks are completed first.
      </Note>
    </Container>
  );
};

export default AISuggestions;
