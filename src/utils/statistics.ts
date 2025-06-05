export const mean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const standardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const avg = mean(values);
  const squareDiffs = values.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};