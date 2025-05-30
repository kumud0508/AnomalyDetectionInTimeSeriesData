import { calculateStatistics, detectSeasonality } from './anomalyUtils';

interface DataPoint {
  timestamp: string;
  value: number;
}

interface Insight {
  type: 'trend' | 'anomaly' | 'seasonality' | 'statistics';
  message: string;
  confidence: number;
}

export const fetchAIInsights = (data: DataPoint[]): Insight[] => {
  const insights: Insight[] = [];
  
  // Calculate basic statistics
  const stats = calculateStatistics(data);
  insights.push({
    type: 'statistics',
    message: `Average value is ${stats.mean.toFixed(2)}, with range from ${stats.min.toFixed(2)} to ${stats.max.toFixed(2)}`,
    confidence: 0.95,
  });

  // Detect trend
  const trend = detectTrend(data);
  if (trend) {
    insights.push({
      type: 'trend',
      message: `There is a ${trend.direction} trend with slope ${trend.slope.toFixed(3)}`,
      confidence: trend.confidence,
    });
  }

  // Check seasonality
  const seasonality = detectSeasonality(data);
  const maxCorrelation = Math.max(...seasonality.map(s => Math.abs(s.correlation)));
  if (maxCorrelation > 0.7) {
    insights.push({
      type: 'seasonality',
      message: `Strong seasonal pattern detected with period of ${
        seasonality.find(s => Math.abs(s.correlation) === maxCorrelation)?.lag
      } days`,
      confidence: maxCorrelation,
    });
  }

  return insights;
};

const detectTrend = (data: DataPoint[]) => {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = data.map(d => d.value);
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, i) => a + i * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  if (Math.abs(slope) < 0.001) return null;
  
  return {
    direction: slope > 0 ? 'upward' : 'downward',
    slope: Math.abs(slope),
    confidence: Math.min(Math.abs(slope) * 10, 0.95),
  };
};