import * as Icons from 'lucide-react';

interface StatItem {
  icon: string;
  label: string;
  value: string;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent;
  };

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => {
        const Icon = getIcon(stat.icon);
        return (
          <div key={index} className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: `${stat.color}10` }}>
              <Icon className="stat-icon" style={{ color: stat.color }} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}