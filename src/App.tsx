import React, { useState, useRef } from 'react'
import "./App.css";

function App() {
  const [pressedKey, setPressedKey] = useState<string>("");
  const [list, setList] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    console.log({ key });

    setPressedKey(key);

    if (key === "Enter") {
      const input = inputRef.current;

      if (!input) return;
      const { value } = input;
      if (!value) return;

      input.value = "";
      setList([...list, value]);
    }
  }

  return (
    <>
      <h1>Editor</h1>
      <div>
        <input
          type="text"
          autoFocus={true}
          placeholder=""
          ref={inputRef}
          onKeyDown={keyDownHandler}
        />
        <p>Pressed key: {pressedKey}</p>
      </div>
      <div style={{ textAlign: "left" }}>
        <p>メモ一覧</p>
        <ul>
        { list.map((item, index) => (
            <li key={index}> { item }</li>
          ))
        }
        </ul>
      </div>
    </>
  );
}

export default App;
