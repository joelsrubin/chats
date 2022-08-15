import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Nav from "../components/Nav";
import { trpc } from "../utils/trpc";
import Ably from "ably";

const ably = new Ably.Realtime(
  "JQheCg.6yacKQ:7W3ZanQZMr2VLOUf6Zj4BO-GSf8SXaN3LM1g-A30wss"
);
const channel = ably.channels.get("test");

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

type Message = {
  text: string;
  date: Date;
};

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  const { data: session, status } = useSession();
  const [messages, setMessage] = useState<Message[]>([]);
  const [curMess, setCurMess] = useState<string>("");

  useEffect(() => {
    channel.subscribe("test", (message) => {
      setMessage([
        ...messages,
        {
          text: message.data,
          date: new Date(),
        },
      ]);
    });

    return () => {
      channel.unsubscribe("test");
    };
  }, [messages]);
  if (status === "loading") {
    return (
      <div className="flex justify-center text-center items-center bg-gray-800 text-white font-mono text-lg">
        Loading...
      </div>
    );
  }

  return (
    <>
      <main className="font-mono text-lg h-screen">
        <h1 className="text-center bg-gray-800 pt-4 decoration-slate-400 underline">
          Chats
        </h1>
        {session ? (
          <>
            <Nav>
              <div className="flex flex-row justify-between">
                <p className="flex justify-center items-center">
                  hi {session.user?.name}
                </p>

                <button onClick={() => signOut()}>Sign out</button>
              </div>
            </Nav>
            <div className="flex flex-col justify-between">
              {messages.map((message, i) => (
                <div
                  className="flex flex-col justify-between odd:text-right mx-10"
                  key={i}
                >
                  <p>{message.text}</p>
                  <p>{message.date.toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center text-center align-center h-full">
            <button onClick={() => signIn("discord")}>
              Log in with discord
            </button>
          </div>
        )}
      </main>
      <footer className="fixed w-full bottom-0 flex justify-center bg-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            channel.publish("test", curMess);
            setCurMess("");
          }}
          className="flex flex-col w-1/4 font-mono text-lg justify-center m-10"
        >
          <input
            type="text"
            onChange={(e) => {
              setCurMess(e.target.value);
            }}
            className="text-black p-2 rounded-sm"
            placeholder="Type a message"
            value={curMess}
          />
          <button className="p-2 mt-2 rounded-md text-black shadow-md shadow-black bg-slate-200 active:shadow-none active:translate-y-0.5">
            send
          </button>
        </form>
      </footer>
    </>
  );
};

const TechnologyCard = ({
  name,
  description,
  documentation,
}: TechnologyCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <a
        className="mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2"
        href={documentation}
        target="_blank"
        rel="noreferrer"
      >
        Documentation
      </a>
    </section>
  );
};

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const NonSSRWrapper = () => <Home />;
export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false,
});
// export default Home;
