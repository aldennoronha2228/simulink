import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Canvas from '@/components/Canvas';
import RightPanel from '@/components/RightPanel';

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950 text-white selection:bg-blue-500/30">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Canvas />
        <RightPanel />
      </div>
    </div>
  );
}
