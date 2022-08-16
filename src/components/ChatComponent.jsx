import { useSession, signIn, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useChannel } from "./ChatReactEffect";
import Nav from "./Nav";

const AblyChatComponent = () => {
  let inputBox = null;
  let messageEnd = null;

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

  const ABLY_CLIENT_ID = ably.auth.clientId;

  return (
    <div className="flex flex-col h-screen font-mono text-lg">
      {session ? (
        <div className="flex flex-col h-full overflow-scroll">
          <Nav>
            <div className="flex flex-row justify-between">
              <p className="flex justify-center items-center">
                hi {session.user?.name}
              </p>
              <h1 className="text-center bg-gray-800 pt-4 decoration-slate-400 underline">
                Chats
              </h1>

              <button onClick={() => signOut()}>Sign out</button>
            </div>
          </Nav>
          <main className="font-mono text-lg overflow-scroll">
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
            </div>
          </main>
        </div>
      ) : (
        <div className="flex justify-center items-center text-center align-center h-full">
          <button onClick={() => signIn("discord")}>Log in with discord</button>
        </div>
      )}
      <footer className="w-full flex justify-center bg-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            channel.publish("test", messageText);
            setMessageText("");
          }}
          className="flex flex-col w-3/4 sm:w-1/2 md:w-1/4 font-mono text-lg justify-center m-10"
        >
          <input
            type="text"
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
            className="text-black p-2 rounded-sm pl-4"
            placeholder="Type a message"
            value={messageText}
          />
          <button className="p-2 mt-2 rounded-md text-black shadow-md shadow-black bg-slate-200 active:shadow-none active:translate-y-0.5">
            send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AblyChatComponent;
