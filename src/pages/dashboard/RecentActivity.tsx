import { Clock, BookOpen, Heart, Bookmark, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const [progressRes, favoritesRes, bookmarksRes] = await Promise.all([
          api.get('/library/progress'),
          api.get('/library/favorites'),
          api.get('/library/bookmarks')
        ]);

        const acts: any[] = [];

        progressRes.data?.forEach((p: any) => {
          acts.push({
            id: `p-${p.item_id}`,
            action: p.progress_percentage === 100 ? 'Finished reading' : 'Started reading',
            book: p.library_items.title,
            time: new Date(p.last_read_at).toLocaleDateString(),
            timestamp: new Date(p.last_read_at).getTime(),
            icon: BookOpen
          });
        });

        favoritesRes.data?.forEach((f: any) => {
          acts.push({
            id: `f-${f.item_id}`,
            action: 'Added to favorites',
            book: f.library_items.title,
            time: new Date(f.created_at).toLocaleDateString(),
            timestamp: new Date(f.created_at).getTime(),
            icon: Heart
          });
        });

        bookmarksRes.data?.forEach((b: any) => {
          acts.push({
            id: `b-${b.item_id}`,
            action: 'Bookmarked',
            book: b.library_items.title,
            time: new Date(b.created_at).toLocaleDateString(),
            timestamp: new Date(b.created_at).getTime(),
            icon: Bookmark
          });
        });

        // Sort by timestamp and take major ones
        setActivities(acts.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary" size={20} />
      </div>
    );
  }

  return (
    <section className="activity-section">
      <div className="section-header">
        <Clock className="section-icon" />
        <h2 className="section-title">Recent Activity</h2>
      </div>
      
      <div className="activity-list">
        {activities.length > 0 ? (
          activities.map((activity) => {
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
          })
        ) : (
          <p className="text-center text-muted-foreground italic py-4">No recent activity.</p>
        )}
      </div>
    </section>
  );
}