// Mock data for candidate reputation for fallback
export const mockReputationData = {
  score: 4.7,
  level: "Trusted",
  totalEvents: 23,
  badgeUrl: "/assets/badges/trusted.svg",
  history: [
    {
      id: 1,
      date: "2023-12-15",
      event: "Completed Job",
      description: "Successfully completed Tech Conference assignment",
      points: 0.5,
      type: "positive"
    },
    {
      id: 2,
      date: "2023-11-28",
      event: "Recruiter Rating",
      description: "5-star rating from EventPro Solutions",
      points: 0.3,
      type: "positive"
    },
    {
      id: 3,
      date: "2023-11-10",
      event: "Early Arrival",
      description: "Arrived 30 minutes before scheduled time",
      points: 0.2,
      type: "positive"
    },
    {
      id: 4,
      date: "2023-10-05",
      event: "Late Cancellation",
      description: "Cancelled Marketing Summit job less than 24 hours before",
      points: -0.8,
      type: "negative"
    },
    {
      id: 5,
      date: "2023-09-20",
      event: "Completed Job",
      description: "Successfully completed Product Launch event",
      points: 0.5,
      type: "positive"
    }
  ],
  reputationLevels: [
    { name: "New", minScore: 0, maxScore: 2.9 },
    { name: "Reliable", minScore: 3.0, maxScore: 4.0 },
    { name: "Trusted", minScore: 4.1, maxScore: 4.8 },
    { name: "Elite", minScore: 4.9, maxScore: 5.0 }
  ]
};

export const getReputationStats = () => {
  return {
    totalPositive: 15,
    totalNegative: 2,
    successfulJobs: 20,
    cancellations: 2,
    noShows: 0,
    onTimeRate: 98
  };
};

export default {
  mockReputationData,
  getReputationStats
}; 