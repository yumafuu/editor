import type React from "react";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import "./App.css";

type ID = number;

type Ticket = {
  id: ID;
  type: TicketType;
  name: string;
};

type TicketType = "task" | "memo" | "plan";

type Mode = "Normal" | "Control" | "Meta";

function App() {
  const [pressedKey, setPressedKey] = useState<string>("");
  const [ticketList, setTicketList] = useState<Ticket[]>([]);
  const [typingType, setTypingType] = useState<TicketType>("memo");
  const [currentFocus, setCurrentFocus] = useState<ID | null>(null);
  const [mode, setMode] = useState<Mode>("Normal");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.focus();
    }
  }, []);

  // ticketListに初期値を追加
  useEffect(() => {
    const initialTicketList: Ticket[] = [
      { id: 1, type: "task", name: "task1" },
      { id: 2, type: "memo", name: "memo1" },
      { id: 3, type: "plan", name: "plan1" },
    ];
    setTicketList(initialTicketList);
  }, []);

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

  const focusNextTicket = () => {
    const current = currentFocus;
    if (current === null) {
      setCurrentFocus(0);
      return;
    }

    let next = current + 1; // TODO: viewで分ける必要がある
    if (next > ticketList.length) {
      next = 0;
    }
    const ticket = document.getElementById(String(next));
    if (ticket) {
      ticket.focus();
      setCurrentFocus(next);
    }
  };

  const focusPrevTicket = () => {
    const current = currentFocus;
    if (current === null) {
      setCurrentFocus(0);
      return;
    }

    let prev = current - 1; // TODO: viewで分ける必要がある
    if (prev < 0) {
      prev = ticketList.length - 1;
    }
    const ticket = document.getElementById(String(prev));
    if (ticket) {
      ticket.focus();
      setCurrentFocus(prev);
    }
  };

  const keyUpHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;

    setPressedKey(key);

    const input = inputRef.current;
    switch (key) {
      case "Enter": {
        switch (mode) {
          case "Normal": {
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
          case "Control": {
            // TODO: Action
            break;
          }
        }
        break;
      }
      case "Control": {
        setMode("Normal");
        break;
      }
      case " ": {
        // Space
        const value = input?.value;
        if (!value) return;
        console.log({ value });

        switch (value) {
          case "t ": {
            setTypingType("task");
            input.value = "";
            break;
          }
          case "d ": {
            setTypingType("plan");
            input.value = "";
            break;
          }
          case "- ": {
            setTypingType("memo");
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
      case "ArrowDown": {
        focusNextTicket();
        break;
      }
      case "ArrowUp": {
        focusPrevTicket();
        break;
      }
      case "j": {
        if (mode === "Control") {
          focusNextTicket();
        }
        break;
      }
      case "k": {
        if (mode === "Control") {
          focusPrevTicket();
        }
        break;
      }
      case "Control": {
        setMode("Control");
        break;
      }
      case "Meta": {
        setMode("Meta");
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
            className="border border-slate-300 p-1 w-full"
            placeholder=""
            ref={inputRef}
            onKeyUp={keyUpHandler}
            onKeyDown={KeyDownHandler}
          />
        </div>

        {/* デバッグ */}
        <pre className="mt-2">
          <p>Mode: {mode}</p>
          <p>Pressed key: {pressedKey}</p>
        </pre>

        <div className="mt-5">
          <p className="text-xl font-thin">チケット一覧</p>
          <div className="mt-2">
            <ul>
              {ticketList.map((ticket) => (
                <li
                  id={String(ticket.id)}
                  key={ticket.id}
                  className={clsx(
                    "border-b border-gray-300 p-2 flex items-center",
                    {
                      "bg-gray-500": ticket.id === currentFocus,
                    },
                  )}
                >
                  <span className="mr-2 w-5">{icon(ticket.type)}</span>
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
