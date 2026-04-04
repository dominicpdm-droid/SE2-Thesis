import { createContext, useState, useContext, useEffect } from "react";

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([]);

  // Load activities from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem("activities");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = (roomName, action, target = null) => {
    const newActivity = {
      id: Date.now(),
      roomName,
      action,
      target, // 'created', 'removed', 'turned_on', 'turned_off'
      timestamp: new Date(),
    };
    setActivities((prev) => [newActivity, ...prev]);
    return newActivity;
  };

  const clearActivities = () => {
    setActivities([]);
  };

  const getActivitiesByDate = (filterType) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return activities.filter((activity) => {
      const actTime = new Date(activity.timestamp);

      if (filterType === "today") {
        return actTime >= todayStart;
      } else if (filterType === "week") {
        return actTime >= weekStart;
      } else if (filterType === "month") {
        return actTime >= monthStart;
      }
      return true;
    });
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        clearActivities,
        getActivitiesByDate,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider");
  }
  return context;
}
