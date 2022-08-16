import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Nav from "../components/Nav";
import { trpc } from "../utils/trpc";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useChannel } from "../components/ChatReactEffect";
const AblyChatComponent = dynamic(() => import("../components/ChatComponent"), {
  ssr: false,
});
type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

type Message = {
  text: string;
  date: Date;
  author: string;
};
// configureAbly({
//   key: "JQheCg.6yacKQ:7W3ZanQZMr2VLOUf6Zj4BO-GSf8SXaN3LM1g-A30wss",
//   clientId: String(Math.floor(Math.random() * 100)),
// });

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center text-center items-center bg-gray-800 text-white font-mono text-lg">
        Loading...
      </div>
    );
  }
  return <AblyChatComponent />;
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

const NonSSRWrapper = () => <Home />;
export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false,
});
// export default Home;
