import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";

import Nav from "../../components/Nav";

type Message = {
  text: string;
  author: string;
  date: Date;
};

const AblyChatComponent = () => {
  const { query } = useRouter();

  let { room } = query as { room: string };
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState<Message[]>([]);

  const { data: session } = useSession();

  const [channel] = useChannel(
    room,
    (message: { data: string; clientId: string }) => {
      boxRef?.current?.scrollIntoView({ behavior: "smooth" });

      setMessages((prev) => [
        ...prev,
        {
          text: message.data,
          author: message.clientId,
          date: new Date(),
        },
      ]);
    }
  );

  const USER_NAME = session?.user?.name;
  const [presenceData] = usePresence(room);

  const others = presenceData
    .filter((item) => {
      item.clientId !== USER_NAME;
    })
    .map((item) => item.clientId);
  useEffect(() => {
    boxRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [receivedMessages]);

  return (
    <div className="text-md flex h-screen flex-col font-mono">
      {session ? (
        <>
          <div className="flex h-full flex-col overflow-auto">
            <Link href="/">
              <h1 className="cursor-pointer bg-gray-800 pt-4 text-center underline decoration-slate-400">
                Chats
              </h1>
            </Link>
            <div className="flex flex-row justify-center gap-2 bg-gray-800">
              <div className="self-end bg-gray-800">
                other folks in the room: {others.length}
              </div>
              {others.length ? (
                <div className="group relative h-2 w-2 cursor-pointer rounded-full bg-green-400">
                  <div>
                    <ul className="absolute hidden w-fit rounded-lg bg-slate-600 p-4 text-xs group-hover:flex">
                      {others.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
            <Nav>
              <div className="flex flex-row justify-between">
                <p className="flex items-center justify-center">
                  hi {session.user?.name} welcome to {room}
                </p>

                <button onClick={() => signOut()}>Sign out</button>
              </div>
            </Nav>
            <main className="text-md overflow-scroll font-mono">
              <div className="flex flex-col justify-between gap-4 py-10">
                {receivedMessages.map(({ author, text }, i) => {
                  return (
                    <div
                      className={`mx-4 flex h-full w-fit flex-col justify-between ${
                        USER_NAME === author && "self-end "
                      }`}
                      key={i}
                    >
                      <div
                        className={`${
                          USER_NAME === author
                            ? "self-end rounded-l-lg rounded-br-lg bg-blue-900 text-right"
                            : "rounded-r-lg rounded-bl-lg bg-amber-400 text-black"
                        } p-4`}
                      >
                        <p>{text}</p>
                      </div>
                      <p
                        className={`pt-2 text-xs ${
                          USER_NAME === author && "self-end"
                        }`}
                      >
                        {author.split(" ")[0]}
                      </p>
                    </div>
                  );
                })}
                <div ref={boxRef}></div>
              </div>
            </main>
          </div>
          <footer className="flex w-full justify-center bg-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                channel.publish(room, messageText);
                setMessageText("");
                inputRef.current?.focus();
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
                ref={inputRef}
              />
              <button className="mt-2 rounded-md bg-slate-200 p-2 text-black shadow-md shadow-black active:translate-y-0.5 active:shadow-none">
                send
              </button>
            </form>
          </footer>
        </>
      ) : (
        <div className="align-center flex h-full items-center justify-center text-center">
          <button
            onClick={() => signIn("discord")}
            className="rounded-sm bg-slate-200 p-4 text-black active:translate-y-0.5 active:shadow-none"
          >
            Log in with google
          </button>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;
  const { room } = query as { room: string };
  return {
    props: {
      room,
    },
  };
}

export default AblyChatComponent;
