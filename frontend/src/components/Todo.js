import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [lastPos, setLastPos] = useState(0);
  const [prePosition, setPrePosition] = useState(0);
  const [curPosition, setCurPosition] = useState(0);

  useEffect(() => {
    async function fetch() {
      const list = await axios.get(BASE_URL + "/todos");
      setTodoList(list.data);
      setLastPos(list.data.length + 1);
    }
    fetch();
  }, []);

  let addTodo = async () => {
    try {
      const newTodo = await axios.post(BASE_URL + "/todos", {
        title,
        link,
        position: lastPos,
      });
      setTodoList(newTodo.data);
    } catch (error) {
      alert("enter all details");
    }
  };

  let deleteTodo = async (id, isCompleted) => {
    try {
      const updateTodo = await axios.patch(`${BASE_URL}/todos/status/${id}`, {
        isCompleted,
      });
      setTodoList(updateTodo.data);
    } catch (error) {
      alert(error);
    }
  };

  let dragDrop = async (id) => {
    try {
      const updateTodo = await axios.patch(`${BASE_URL}/todos/${id}`, {
        prePosition,
        curPosition,
      });
      setTodoList(updateTodo.data);
    } catch (error) {
      alert(error);
    }
  };

  let todoDetails = (item) => {
    return (
      <div className="ml-6 overflow-hidden">
        <p className="text-lg font-medium text-slate-900">{item.title}</p>
        <a className="text-lg text-slate-500 truncate" href={item.link}>
          Link
        </a>
      </div>
    );
  };

  return (
    <>
      <div className="relative p-10 rounded-md shadow-sm container mx-auto px-4 border-2 ">
        <div className="w-full flex justify-center">
          <span className="text-lg font-large text-slate-700 mr-6">
            Title :{" "}
          </span>
          <input
            type="text"
            name="todo"
            id="todo"
            className="w-100 me-5 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 lg:text-lg lg:leading-1"
            placeholder="enter Title... "
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></input>

          <span className="text-lg font-large text-slate-700 mr-6">Url : </span>
          <input
            type="text"
            name="todo"
            id="todo"
            className=" w-100 me-5 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 lg:text-lg lg:leading-1"
            placeholder="enter Url..."
            onChange={(e) => {
              setLink(e.target.value);
            }}
          ></input>
          <button
            className="w-100 py-1.5 pl-7 pr-7 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
            onClick={addTodo}
          >
            add
          </button>
        </div>
        <div className="flex justify-center">
          <ul className="p-6 divide-y divide-slate-200">
            {todoList.map((item, index) => {
              return (
                <li
                  className=" flex py-3 hover:bg-slate-100 p-10 cursor-move items-center "
                  key={index}
                  draggable
                  onDragStart={(e) => setPrePosition(item.position)}
                  onDragEnter={(e) => setCurPosition(todoList[index].position)}
                  onDragEnd={(e) => dragDrop(item._id)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <FontAwesomeIcon icon={faBars} className="mr-4" />

                  <input
                    type="checkbox"
                    value={!item.isCompleted}
                    defaultChecked={item.isCompleted}
                    checked={item.isCompleted}
                    onChange={(e) => {
                      item.isCompleted = !item.isCompleted;
                      deleteTodo(item._id, item.isCompleted);
                    }}
                  />
                  {item.isCompleted ? (
                    <s>{todoDetails(item)}</s>
                  ) : (
                    todoDetails(item)
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Todo;
