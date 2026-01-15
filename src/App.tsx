import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Sidebar, MainContent } from '@/components/layout';

function MainDashboard() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

function SubDashboard() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex flex-col flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Sub Dashboard</h1>
        <p className="text-gray-400">Composition Grid, Slot Mapping, Render Queue</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/sub" element={<SubDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
