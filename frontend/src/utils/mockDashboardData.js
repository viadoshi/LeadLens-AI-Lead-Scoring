/**
 * Temporary UI mock data. Replace with API responses during backend integration.
 * Corresponds to future endpoint: GET /api/analytics/overview
 */

export const mockDashboardData = {
  kpis: [
    {
      id: 'total-leads',
      label: 'Total Leads',
      metric: '12,482',
      supporting: 'Across all sources',
      icon: 'Users',
    },
    {
      id: 'hot-leads',
      label: 'Hot Leads',
      metric: '1,284',
      supporting: 'High-priority opportunities',
      icon: 'Flame',
      isAccent: true,
    },
    {
      id: 'predicted-conversions',
      label: 'Predicted Conversions',
      metric: '2,147',
      supporting: 'AI-estimated conversions',
      icon: 'Target',
    },
    {
      id: 'conversion-rate',
      label: 'Conversion Rate',
      metric: '17.2%',
      supporting: 'Current conversion rate',
      icon: 'TrendingUp',
    },
  ],

  conversionTrends: {
    '7d': [
      { date: 'Oct 16', totalLeads: 280, convertedLeads: 46, conversionRate: 16.4 },
      { date: 'Oct 17', totalLeads: 310, convertedLeads: 52, conversionRate: 16.8 },
      { date: 'Oct 18', totalLeads: 295, convertedLeads: 51, conversionRate: 17.3 },
      { date: 'Oct 19', totalLeads: 330, convertedLeads: 59, conversionRate: 17.9 },
      { date: 'Oct 20', totalLeads: 345, convertedLeads: 61, conversionRate: 17.7 },
      { date: 'Oct 21', totalLeads: 360, convertedLeads: 65, conversionRate: 18.1 },
      { date: 'Oct 22', totalLeads: 375, convertedLeads: 69, conversionRate: 18.4 },
    ],
    '30d': [
      { date: 'Sep 23', totalLeads: 380, convertedLeads: 61, conversionRate: 16.1 },
      { date: 'Sep 26', totalLeads: 410, convertedLeads: 67, conversionRate: 16.3 },
      { date: 'Sep 29', totalLeads: 395, convertedLeads: 65, conversionRate: 16.5 },
      { date: 'Oct 02', totalLeads: 420, convertedLeads: 71, conversionRate: 16.9 },
      { date: 'Oct 05', totalLeads: 440, convertedLeads: 75, conversionRate: 17.0 },
      { date: 'Oct 08', totalLeads: 430, convertedLeads: 73, conversionRate: 17.0 },
      { date: 'Oct 11', totalLeads: 465, convertedLeads: 80, conversionRate: 17.2 },
      { date: 'Oct 14', totalLeads: 480, convertedLeads: 83, conversionRate: 17.3 },
      { date: 'Oct 17', totalLeads: 510, convertedLeads: 90, conversionRate: 17.6 },
      { date: 'Oct 20', totalLeads: 535, convertedLeads: 96, conversionRate: 17.9 },
      { date: 'Oct 22', totalLeads: 550, convertedLeads: 101, conversionRate: 18.4 },
    ],
    '90d': [
      { date: 'Aug W1', totalLeads: 1200, convertedLeads: 180, conversionRate: 15.0 },
      { date: 'Aug W3', totalLeads: 1350, convertedLeads: 210, conversionRate: 15.5 },
      { date: 'Sep W1', totalLeads: 1420, convertedLeads: 228, conversionRate: 16.0 },
      { date: 'Sep W3', totalLeads: 1510, convertedLeads: 249, conversionRate: 16.5 },
      { date: 'Oct W1', totalLeads: 1630, convertedLeads: 278, conversionRate: 17.1 },
      { date: 'Oct W3', totalLeads: 1750, convertedLeads: 312, conversionRate: 17.8 },
    ],
  },

  leadSources: [
    { source: 'Referral', conversionRate: 28.5, leadsCount: 752 },
    { source: 'LinkedIn', conversionRate: 24.8, leadsCount: 3840 },
    { source: 'Webinar', conversionRate: 22.1, leadsCount: 1280 },
    { source: 'Google Ads', conversionRate: 19.4, leadsCount: 3120 },
    { source: 'Website', conversionRate: 16.5, leadsCount: 2450 },
    { source: 'Email', conversionRate: 13.8, leadsCount: 1040 },
  ],

  leadDistribution: [
    { segment: 'HOT', count: 1284, percentage: 10.3, description: 'Score 80–100' },
    { segment: 'WARM', count: 3450, percentage: 27.6, description: 'Score 60–79' },
    { segment: 'NURTURE', count: 5120, percentage: 41.0, description: 'Score 40–59' },
    { segment: 'COLD', count: 2628, percentage: 21.1, description: 'Score 0–39' },
  ],

  topPriorityLeads: [
    {
      id: '101',
      lead: 'Sarah Mitchell',
      title: 'VP of Revenue Operations',
      company: 'Acme Technologies',
      score: 87,
      segment: 'HOT',
      recommendedAction: 'Contact immediately',
    },
    {
      id: '102',
      lead: 'Marcus Vance',
      title: 'Head of Sales Systems',
      company: 'CloudScale Systems',
      score: 92,
      segment: 'HOT',
      recommendedAction: 'Schedule enterprise demo',
    },
    {
      id: '103',
      lead: 'Elena Rostova',
      title: 'Chief Technology Officer',
      company: 'FinPulse Software',
      score: 84,
      segment: 'HOT',
      recommendedAction: 'Send technical whitepaper',
    },
    {
      id: '104',
      lead: 'David Chen',
      title: 'Director of Growth',
      company: 'Nexus Logistics',
      score: 81,
      segment: 'HOT',
      recommendedAction: 'Trigger executive outbound',
    },
    {
      id: '105',
      lead: 'Aria Montgomery',
      title: 'VP of Enterprise Sales',
      company: 'Synthetix AI',
      score: 89,
      segment: 'HOT',
      recommendedAction: 'Direct AE discovery call',
    },
  ],
};

export default mockDashboardData;
