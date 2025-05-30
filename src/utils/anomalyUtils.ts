import { subDays, format } from 'date-fns';

interface DataPoint {
  timestamp: string;
  value: number;
  movingAvg?: number;
}

export const generateMovingAverage = (data: DataPoint[], windowSize = 5) => {
  return data.map((d, i) => {
    const start = Math.max(0, i - windowSize + 1);
    const subset = data.slice(start, i + 1);
    const avg = subset.reduce((sum, p) => sum + p.value, 0) / subset.length;
    return { ...d, movingAvg: avg };
  });
};

export const detectAnomalies = (data: DataPoint[], threshold: number) => {
  return data.filter(d => Math.abs(d.value - (d.movingAvg || 0)) > threshold);
};

export const generateMockTimeSeriesData = (days = 30) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - i - 1);
    return {
      timestamp: format(date, 'yyyy-MM-dd'),
      value: Math.sin(i * 0.5) * 10 + Math.random() * 5 + 20,
    };
  });
};

export const calculateStatistics = (data: DataPoint[]) => {
  const values = data.map(d => d.value);
  return {
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    max: Math.max(...values),
    min: Math.min(...values),
    std: Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - (values.reduce((a, b) => a + b, 0) / values.length), 2), 0) / values.length
    ),
  };
};

export const detectSeasonality = (data: DataPoint[], period = 7) => {
  const values = data.map(d => d.value);
  const correlations = [];
  
  for (let lag = 1; lag <= period; lag++) {
    const pairs = values.slice(lag).map((val, i) => ({
      x: values[i],
      y: val,
    }));
    
    const correlation = calculateCorrelation(pairs);
    correlations.push({ lag, correlation });
  }
  
  return correlations;
};

const calculateCorrelation = (pairs: { x: number; y: number }[]) => {
  const n = pairs.length;
  const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
  const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
  const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
  const sumX2 = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
  const sumY2 = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return numerator / denominator;
};