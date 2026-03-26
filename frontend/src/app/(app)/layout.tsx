import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { TourProvider } from "@/components/tour/TourProvider";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TourProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--st-bg)]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-[var(--st-bg)]">{children}</main>
        </div>
      </div>
    </TourProvider>
  );
}
