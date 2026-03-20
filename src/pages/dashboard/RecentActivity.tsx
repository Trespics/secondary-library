import { Clock, BookOpen, Heart, Bookmark } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    { id: 1, type: 'read', action: 'Finished reading', book: '1984', time: '2 hours ago', icon: BookOpen },
    { id: 2, type: 'bookmark', action: 'Bookmarked page 45', book: 'The Great Gatsby', time: '5 hours ago', icon: Bookmark },
    { id: 3, type: 'favorite', action: 'Added to favorites', book: 'To Kill a Mockingbird', time: '1 day ago', icon: Heart },
    { id: 4, type: 'read', action: 'Started reading', book: 'Dune', time: '2 days ago', icon: BookOpen },
  ];

  return (
    <section className="activity-section">
      <div className="section-header">
        <Clock className="section-icon" />
        <h2 className="section-title">Recent Activity</h2>
      </div>
      
      <div className="activity-list">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon-wrapper">
                <Icon size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-action">
                  {activity.action} <strong>"{activity.book}"</strong>
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}