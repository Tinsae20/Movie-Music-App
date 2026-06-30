import Sidebar from "@/components/layout/Sidebar";
import AudioPlayer from "@/components/player/AudioPlayer";
import MiniPlayer from "@/components/player/MiniPlayer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      <AudioPlayer />
      <MiniPlayer />
    </div>
  );
}
