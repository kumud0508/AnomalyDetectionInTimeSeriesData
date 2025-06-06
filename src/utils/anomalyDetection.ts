import { mean, standardDeviation } from './statistics';

interface AnomalyResult {
  anomalies_detected: "Yes" | "No";
  anomaly_indices: number[];
  explanation: string;
}

// Calculate z-score manually since we removed the statistics.js dependency
const calculateZScore = (value: number, values: number[]): number => {
  const meanValue = mean(values);
  const stdDev = standardDeviation(values);
  return Math.abs((value - meanValue) / stdDev);
};

export const detectAnomalies = (data: number[]): AnomalyResult => {
  if (data.length === 0) {
    return {
      anomalies_detected: "No",
      anomaly_indices: [],
      explanation: "No data points provided for analysis."
    };
  }

  // Calculate z-scores for the data points
  const zScores = data.map(value => calculateZScore(value, data));
  
  // Define threshold for anomaly detection (typically 3 standard deviations)
  const threshold = 3;
  
  // Find indices where z-score exceeds threshold
  const anomalyIndices = zScores
    .map((score, index) => score > threshold ? index : -1)
    .filter(index => index !== -1);
  
  if (anomalyIndices.length === 0) {
    return {
      anomalies_detected: "No",
      anomaly_indices: [],
      explanation: "No significant deviations detected."
    };
  }
  
  return {
    anomalies_detected: "Yes",
    anomaly_indices: anomalyIndices,
    explanation: `Found ${anomalyIndices.length} points that deviate significantly from the mean (beyond ${threshold} standard deviations).`
  };
};

export const preprocessData = (data: any[]): number[] => {
  // Extract numerical values and handle missing data
  return data
    .map(row => {
      const value = parseFloat(row.value);
      return isNaN(value) ? null : value;
    })
    .filter((value): value is number => value !== null);
};