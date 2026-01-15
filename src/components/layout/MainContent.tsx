import React from 'react';

export const MainContent: React.FC = () => {
  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-900" data-testid="main-content">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hand Browser Panel */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Hand Browser</h2>
          <div className="space-y-3">
            {[42, 41, 40, 39, 38].map((handNum) => (
              <div
                key={handNum}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-white">#{handNum}</span>
                  <div>
                    <p className="text-sm text-gray-300">$200/$400</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-600 text-xs text-white rounded">COMPLETED</span>
                  <span className="text-sm text-gray-400">9 players</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          {/* Session Stats */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700" data-testid="session-stats">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Session Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Hands Played</span>
                <span className="text-2xl font-bold text-white" data-testid="stat-hand-count">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Players</span>
                <span className="text-2xl font-bold text-white" data-testid="stat-active-players">9</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Blind Level</span>
                <span className="text-lg font-bold text-white" data-testid="stat-blind-level">$200/$400</span>
              </div>
            </div>
          </div>

          {/* Render Queue Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Render Queue</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Queued</span>
                <span className="text-xl font-bold text-yellow-400">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Rendering</span>
                <span className="text-xl font-bold text-blue-400">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed</span>
                <span className="text-xl font-bold text-green-400">28</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
