import React from 'react';

interface TabProps {
  id: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const Tab: React.FC<TabProps> = ({ id, label, active, onClick }) => (
  <button
    data-testid={`tab-nav-${id}`}
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
      active
        ? 'bg-gray-800 text-white border-b-2 border-blue-500'
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
  >
    {label}
  </button>
);

interface TabNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab = 'hands',
  onTabChange
}) => {
  const tabs = [
    { id: 'hands', label: 'Hand Browser' },
    { id: 'cuesheet', label: 'Cuesheet' },
    { id: 'players', label: 'Players' },
    { id: 'monitor', label: 'Monitor' },
  ];

  return (
    <div className="flex space-x-1 border-b border-gray-700 px-6">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          id={tab.id}
          label={tab.label}
          active={activeTab === tab.id}
          onClick={() => onTabChange?.(tab.id)}
        />
      ))}
    </div>
  );
};
