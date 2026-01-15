import React from 'react';
import { useSessionStore } from '../../stores';

interface BroadcastStatusProps {
  status: 'live' | 'paused' | 'ended';
}

const BroadcastStatus: React.FC<BroadcastStatusProps> = ({ status }) => {
  const statusConfig = {
    live: { color: 'bg-green-500', text: 'LIVE', pulse: true },
    paused: { color: 'bg-yellow-500', text: 'PAUSED', pulse: false },
    ended: { color: 'bg-gray-500', text: 'ENDED', pulse: false },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span className="text-sm font-bold text-green-400 uppercase tracking-wide">
        {config.text}
      </span>
    </div>
  );
};

export const Header: React.FC = () => {
  const { sessionId, status, gameType } = useSessionStore();

  return (
    <header className="bg-broadcast-card border-b border-broadcast-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Broadcast Status */}
        <div className="flex items-center space-x-4">
          <BroadcastStatus status={status} />
          <div className="h-6 w-px bg-broadcast-border" />
          <span className="text-sm text-gray-400">Session</span>
          <span className="font-mono text-sm text-white">
            {sessionId || 'No Session'}
          </span>
        </div>

        {/* Session Selector */}
        <div className="flex items-center space-x-4">
          <select
            className="bg-broadcast-bg border border-broadcast-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-broadcast-accent"
            value={sessionId || ''}
            disabled={!sessionId}
          >
            <option value="">Select Session...</option>
            <option value="session-1">WSOP Main Event - Day 2</option>
            <option value="session-2">WSOP $10K High Roller</option>
            <option value="session-3">WSOP Ladies Championship</option>
          </select>
          <button className="px-4 py-2 bg-broadcast-accent text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition">
            New Session
          </button>
        </div>
      </div>
    </header>
  );
};
