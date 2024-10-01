import http from "node:http";
import { createTables } from "./database/createTables.js";
import { getAllTodos, addNewTodo, removeTodo, markAsDone } from "./todos.js";
import { getJsonBody, isTerminatedCrossOriginRequest } from "./requests.js";

// ensure that database has all the necessary tables
await createTables();

// Our server will run the provided callback function every time
// it receives a request.
const server = http.createServer(async (req, res) => {
  if (isTerminatedCrossOriginRequest(req, res)) return;

  // Set HTTP status code to 200 (OK) and inform the client
  // that we will be returning JSON data.
  res.writeHead(200, { "Content-Type": "application/json" });

  const { method, url } = req;

  // Handle DELETE
  if (method === "DELETE" && url) {
    const match = url.match(/\/todos\/(\d+)/);
    if (match) {
      const delete_id = match[1];
      removeTodo(delete_id);
    }
  }
  // Handle GET
  if (method === "GET" && url === "/todos") {
    const todos = getAllTodos();
    const jsonString = JSON.stringify(todos);
    res.end(jsonString);
    return;
  }
  // Handle POST
  if (method === "POST" && url === "/todos") {
    const todoBody = await getJsonBody(req);
    const todo = addNewTodo(todoBody.title);
    const jsonString = JSON.stringify(todo);
    res.end(jsonString);
  }
  // TODO: handle PATCH /todos/:id/done
  if (method === "PATCH" && url) {
    const match = url.match(/\/todos\/(\d+)\/done/);
    if (match) {
      const patch_id = match[1];
      markAsDone(patch_id);
    }
  }
  // if no URL matched, return a 404 (Not found) status code
  // and an error message in JSON string format
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000/");
});
