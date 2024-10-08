import type React from "react";
import { useRef, useState } from "react";
import "./App.css";

type Ticket = {
  id: number;
  type: TicketType;
  name: string;
};

type TicketType = "task" | "memo" | "plan";

function App() {
  const [pressedKey, setPressedKey] = useState<string>("");
  const [ticketList, setTicketList] = useState<Ticket[]>([]);
  const [typingType, setTypingType] = useState<TicketType>("memo");
  const inputRef = useRef<HTMLInputElement>(null);

  const icon = (type: TicketType) => {
    switch (type) {
      case "task": {
        return <input type="checkbox" className="w-4 h-4 rounded-lg" />;
      }
      case "memo": {
        return <span className="text-sm">-</span>;
      }
      case "plan": {
        return <span className="text-sm">📅</span>;
      }
    }
  };

  const keyUpHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;

    setPressedKey(key);

    const input = inputRef.current;
    switch (key) {
      case "Enter": {
        const value = input?.value;
        if (!value) return;

        input.value = "";
        const newTicket = {
          id: ticketList.length + 1,
          type: typingType,
          name: value,
        };
        setTicketList([...ticketList, newTicket]);
        setTypingType("memo");
        break;
      }
      case " ": {
        // Space
        const value = input?.value;
        if (!value) return;
        console.log({ value });

        switch (value) {
          case "- ": {
            setTypingType("task");
            input.value = "";
            break;
          }
          case "d ": {
            setTypingType("plan");
            input.value = "";
            break;
          }
        }
        break;
      }
    }
  };

  const KeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;

    const input = inputRef.current;
    switch (key) {
      case "Backspace": {
        const value = input?.value;
        if (value === "") {
          setTypingType("memo");
        }
        break;
      }
    }
  };

  return (
    <>
      <header className="mt-5 flex justify-center">
        <h1 className="text-3xl">Editor</h1>
      </header>

      <div className="mx-5">
        {/* 入力 */}

        <div className="flex mt-5 items-center">
          <div className="mr-2 w-4 my-auto">{icon(typingType)}</div>
          <input
            type="text"
            autoFocus={true}
            className="border border-slate-300 p-1 w-full"
            placeholder=""
            ref={inputRef}
            onKeyUp={keyUpHandler}
            onKeyDown={KeyDownHandler}
          />
        </div>

        {/* デバッグ */}
        <p className="mt-2">Pressed key: {pressedKey}</p>

        <div className="mt-5">
          <p className="text-xl font-thin">チケット一覧</p>
          <div className="mt-2">
            <ul>
              {ticketList.map((ticket) => (
                <li
                  key={ticket.id}
                  className="border-b border-gray-300 p-2 flex items-center"
                >
                  <span className="mr-2">{icon(ticket.type)}</span>
                  <pre> {ticket.name} </pre>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
