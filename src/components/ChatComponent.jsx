import { useSession, signIn, signOut } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useChannel } from "./ChatReactEffect";
import Nav from "./Nav";

const AblyChatComponent = () => {
  const boxRef = useRef();

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);

  const messageTextIsEmpty = messageText.trim().length === 0;
  const { data: session } = useSession();

  const [channel, ably] = useChannel("test", (message) => {
    setMessages((prev) => [
      ...prev,
      {
        text: message.data,
        author: message.clientId,
        date: new Date(),
      },
    ]);
  });

  useEffect(() => {
    boxRef.current.scrollIntoView({ behavior: "smooth" });
  }, [receivedMessages]);

  const ABLY_CLIENT_ID = ably.auth.clientId;

  return (
    <div className="flex h-screen flex-col font-mono text-lg">
      {session ? (
        <div className="flex h-full flex-col overflow-scroll">
          <Nav>
            <div className="flex flex-row justify-between">
              <p className="flex items-center justify-center">
                hi {session.user?.name}
              </p>
              <h1 className="bg-gray-800 pt-4 text-center underline decoration-slate-400">
                Chats
              </h1>

              <button onClick={() => signOut()}>Sign out</button>
            </div>
          </Nav>
          <main className="overflow-scroll font-mono text-lg">
            <div className="flex flex-col justify-between py-10">
              {receivedMessages.map((message, i) => {
                return (
                  <div
                    className={`flex flex-col justify-between ${
                      message.author === ABLY_CLIENT_ID && "text-right"
                    } mx-10`}
                    key={i}
                  >
                    <p>{message.text}</p>
                    <p>{message.date.toLocaleTimeString()}</p>
                  </div>
                );
              })}
              <div ref={boxRef}></div>
            </div>
          </main>
        </div>
      ) : (
        <div className="align-center flex h-full items-center justify-center text-center">
          <button onClick={() => signIn("discord")}>Log in with discord</button>
        </div>
      )}
      <footer className="flex w-full justify-center bg-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            channel.publish("test", messageText);
            setMessageText("");
          }}
          className="m-10 flex w-3/4 flex-col justify-center font-mono text-lg sm:w-1/2 md:w-1/4"
        >
          <input
            type="text"
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
            className="rounded-sm p-2 pl-4 text-black"
            placeholder="Type a message"
            value={messageText}
            autoFocus
          />
          <button className="mt-2 rounded-md bg-slate-200 p-2 text-black shadow-md shadow-black active:translate-y-0.5 active:shadow-none">
            send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AblyChatComponent;
