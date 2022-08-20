import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import dynamic from "next/dynamic";

import Link from "next/link";

type TechnologyCardProps = {
  name: string;
  description: string;
};

type Message = {
  text: string;
  date: Date;
  author: string;
};

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center bg-gray-800 text-center font-mono text-lg text-white">
        Loading...
      </div>
    );
  }
  return <Rooms />;
};

const Rooms = () => {
  const rooms = ["room1", "test", "debate", "chill_out", "friends"];
  return (
    <>
      <div className="align-center flex h-screen flex-col items-center justify-center gap-5">
        <h1 className="p-2 text-center font-mono text-6xl italic underline decoration-dotted underline-offset-8">
          chats
        </h1>
        {rooms.map((room) => (
          <TechnologyCard name={room} description={""} key={room} />
        ))}
      </div>
    </>
  );
};

const TechnologyCard = ({ name, description }: TechnologyCardProps) => {
  return (
    <Link href={`/chat/${name}`}>
      <section className="flex w-1/2 cursor-pointer flex-col justify-center rounded border-2 border-gray-500 p-6 font-mono text-white shadow-xl duration-200 motion-safe:hover:scale-105">
        <h2 className="text-lg ">{name}</h2>
        <p className="text-sm ">{description}</p>
        <a className="mt-3 cursor-pointer text-sm text-violet-500 underline decoration-dotted underline-offset-2">
          Select
        </a>
      </section>
    </Link>
  );
};

const NonSSRWrapper = () => <Home />;
export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false,
});
// export default Home;
