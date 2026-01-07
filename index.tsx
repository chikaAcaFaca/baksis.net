
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Profile } from './components/Profile';
import { AIHost } from './components/AIHost';
import { Feed } from './components/Feed';
import { Chat } from './components/Chat';
import { AdminDashboard } from './components/AdminDashboard';
import { CreatorStudio } from './components/CreatorStudio';
import { Search } from './components/Search';

const App = () => {
  return (
    // Koristimo BrowserRouter bez basename jer ide u root public_html
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/studio" element={<CreatorStudio />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:username" element={<Profile />} />
          {/* Catch-all ruta za spa ruting */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <AIHost />
    </BrowserRouter>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
