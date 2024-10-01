import { database as db } from "./database/database.js";

export function getAllTodos() {
  return db.prepare("SELECT * FROM todos").all();
  // Add error handling later
}
export function addNewTodo(title) {
  const toAdd = db.prepare("INSERT INTO todos (title) VALUES (?)");
  toAdd.run(title);
  // Add error handling later
}
export function removeTodo(id) {
  const toRemove = db.prepare("DELETE FROM todos WHERE id = (?)");
  toRemove.run(id);
  // Add error handling later
}
export function markAsDone(id) {
  const toPatch = db.prepare("UPDATE todos SET is_done = TRUE WHERE id = ?");
  toPatch.run(id);
  // Add error handling later
}
