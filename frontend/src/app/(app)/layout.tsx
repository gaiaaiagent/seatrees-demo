import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
