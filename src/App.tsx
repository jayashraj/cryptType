import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import logo from "./logo.svg";
import styled from "styled-components";
import "./App.css";

const StyledPage = styled.div`
  font-size: 30px;
  padding: 10px;
  cursor: text;
  height: 100vh;
  white-space: pre-wrap;

  input {
    border: none;
    width: 0px;
    font-size: 30px;

    &:focus {
      outline: none;
    }
  }
  .animated {
    opacity: 0.87;
    display: inline-block;
    position: relative;
    left: -5px;

    animation: blink-animation 2s steps(5, start) infinite;
  }
  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
`;

function downloadPlainText(name: string, content: string) {
  //https://stackoverflow.com/questions/35547835/how-to-create-txt-file-in-javascript
  var link = document.createElement("a");
  var file = new Blob([content], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = name;
  link.click();
}

function App() {
  const [inputValue, changeInputValue] = useState("");
  const [inputBoxValue, changeInputBoxValue] = useState("");
  const [randomValue, changeRandomValue] = useState("");
  const [currentWord, changeCurrentWord] = useState("");
  const [darkTheme, setDarkTheme] = useState(false);
  const [copied, setCopied] = useState(false);
  console.log(inputValue);

  const saveText = (download: boolean) => {
    let text = inputValue
      .replace(/:[cC]opy ?/g, "")
      .replace(/:[dD]ark ?/g, "")
      .replace(/:[lL]ight ?/g, "")
      .replace(/:[sS]ave ?/g, "");

    if (download) {
      let date = Date.now();
      downloadPlainText(`${date.toString()}.txt`, text);
    } else {
      navigator.clipboard.writeText(text).then(() => {});
    }
    setCopied(true);
  };
  const clearAll = () => {
    changeInputValue("");
    changeRandomValue("");
    changeCurrentWord("");
  };
  const addLetter = (letter: string) => {
    changeCurrentWord("");
    changeRandomValue(randomValue + letter);
    changeInputValue(inputValue + letter);
  };

  return (
    <StyledPage
      className="App"
      onClick={() => {
        document.getElementById("input-box")?.focus();
      }}
      style={
        darkTheme
          ? { backgroundColor: "black", color: "white" }
          : { backgroundColor: "white", color: "black" }
      }
    >
      {randomValue}
      <input
        autoFocus
        id="input-box"
        readOnly
        style={
          darkTheme
            ? { backgroundColor: "black", color: "white" }
            : { backgroundColor: "white", color: "black" }
        }
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          event.preventDefault();
          if (
            event.key.length > 1 &&
            event.key !== "Enter" &&
            event.key !== "Backspace"
          ) {
          } else if (event.key.length > 1 && event.key == "Enter") {
            if (currentWord == ":copy" || currentWord == ":Copy") {
              saveText(false);
              addLetter("\n");
            } else if (currentWord == ":save" || currentWord == ":Save") {
              saveText(true);
              addLetter(" ");
            } else if (currentWord == ":dark" || currentWord == ":Dark") {
              setDarkTheme(true);
              addLetter("\n");
            } else if (currentWord == ":light" || currentWord == ":Light") {
              setDarkTheme(false);
              addLetter("\n");
            } else if (currentWord == ":clear" || currentWord == ":Clear") {
              clearAll();
            } else {
              addLetter("\n");
            }
          } else if (event.key.length > 1 && event.key == "Backspace") {
            changeCurrentWord(currentWord.substr(0, currentWord.length - 1));
            changeInputValue(inputValue.substr(0, inputValue.length - 1));
            changeRandomValue(randomValue.substr(0, randomValue.length - 1));
          } else if (event.key == " ") {
            if (currentWord == ":copy" || currentWord == ":Copy") {
              saveText(false);
              addLetter(" ");
            } else if (currentWord == ":save" || currentWord == ":Save") {
              saveText(true);
              addLetter(" ");
            } else if (currentWord == ":dark" || currentWord == ":Dark") {
              setDarkTheme(true);
              addLetter(" ");
            } else if (currentWord == ":light" || currentWord == ":Light") {
              setDarkTheme(false);
              addLetter(" ");
            } else if (currentWord == ":clear" || currentWord == ":Clear") {
              clearAll();
            } else {
              addLetter(" ");
            }
          } else {
            changeRandomValue(
              randomValue + Math.random().toString(36).substring(2, 3)
            );
            changeCurrentWord(currentWord + event.key);
            changeInputValue(inputValue + event.key);
            setCopied(false);
          }

          changeInputBoxValue("");
        }}
      />
      <div
        className="animated"
        style={
          copied
            ? { color: "green" }
            : darkTheme
            ? { color: "white" }
            : { color: "black" }
        }
      >
        |
      </div>
    </StyledPage>
  );
}

export default App;
