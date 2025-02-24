import React from 'react';
import { Wallet } from 'lucide-react';
import { Dashboard } from './components/Dashboard';

function App() {
  console.log('App component rendering'); // Debug log
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold">Finance Manager</span>
            </div>
          </div>
        </div>
      </nav>
      <Dashboard />
    </div>
  );
}

export default App;