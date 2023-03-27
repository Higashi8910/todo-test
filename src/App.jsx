import React, { useState, useEffect } from "react";
import "./styles.css";
import { InputTodo } from "./components/InputTodo";
import { IncompleteTodos } from "./components/IncompleteTodos";
import { CompleteTodos } from "./components/CompleteTodos";

export const App = () => {
  //const [変数名, 変数に値を設定する関数]
  const [todoText, setTodoText] = useState("");
  const [incompleteTodos, setIncompleteTodos] = useState([]);
  const [completeTodos, setCompleteTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("http://localhost:5000/todos");
      const todos = await response.json();
      const incomplete = todos.filter((todo) => !todo.completed);
      const complete = todos.filter((todo) => todo.completed);
      setIncompleteTodos(incomplete);
      setCompleteTodos(complete);
    };
    fetchTodos();
  }, []);
  //入力した値が変化したときにリアルタイムでテキストボックスに代入する用
  const onChangeTodoText = (event) => setTodoText(event.target.value);

  const onClickAdd = async () => {
    if (todoText === "") return;
    const newTodo = { text: todoText, completed: false };
    const response = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    const createdTodo = await response.json();
    setIncompleteTodos([...incompleteTodos, createdTodo]);
    setTodoText("");
  };

  const onClickDelete = async (index) => {
    const todo = incompleteTodos[index];
    await fetch(`http://localhost:5000/todos/${todo._id}`, {
      method: "DELETE",
    });
    const newTodos = [...incompleteTodos];
    newTodos.splice(index, 1);
    setIncompleteTodos(newTodos);
  };
  const onClickComplete = async (index) => {
    const todo = incompleteTodos[index];
    const updatedTodo = { ...todo, completed: true };
    await fetch(`http://localhost:5000/todos/${todo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    const newIncompleteTodos = [...incompleteTodos];
    newIncompleteTodos.splice(index, 1);
    setIncompleteTodos(newIncompleteTodos);

    const newCompleteTodos = [...completeTodos, updatedTodo];
    setCompleteTodos(newCompleteTodos);
  };

  const onClickBack = async (index) => {
    const todo = completeTodos[index];
    const updatedTodo = { ...todo, completed: false };
    await fetch(`http://localhost:5000/todos/${todo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    const newCompleteTodos = [...completeTodos];
    newCompleteTodos.splice(index, 1);
    setCompleteTodos(newCompleteTodos);

    const newIncompleteTodos = [...incompleteTodos, updatedTodo];
    setIncompleteTodos(newIncompleteTodos);
  };

  return (
    <>
      <InputTodo
        todoText={todoText}
        onChange={onChangeTodoText}
        onClick={onClickAdd}
        disabled={incompleteTodos.length >= 5}
      />
      {incompleteTodos.length >= 5 && (
        <p style={{ color: "red" }}>登録ができるtodoは5個までです。</p>
      )}
      <IncompleteTodos
        todos={incompleteTodos}
        onClickComplete={onClickComplete}
        onClickDelete={onClickDelete}
      />
      <CompleteTodos todos={completeTodos} onClickBack={onClickBack} />
    </>
  );
};
