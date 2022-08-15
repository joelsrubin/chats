export default function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className=" bg-gray-800 p-6">
      <div>{children}</div>
    </nav>
  );
}
