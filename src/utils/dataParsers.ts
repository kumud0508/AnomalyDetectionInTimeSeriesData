import Papa from 'papaparse';

interface DataPoint {
  timestamp: string;
  value: number;
  [key: string]: any;
}

export const parseCSV = (text: string): DataPoint[] => {
  const result = Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parsing error: ${result.errors[0].message}`);
  }

  return result.data.map((row: any) => ({
    timestamp: row.timestamp || row.date || new Date().toISOString(),
    value: row.value || row.measurement || 0,
    ...row,
  }));
};

export const parseJSON = (text: string): DataPoint[] => {
  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const validateDataFormat = (data: DataPoint[]): boolean => {
  return data.every(point => 
    typeof point.timestamp === 'string' &&
    typeof point.value === 'number' &&
    !isNaN(point.value)
  );
};

export const normalizeData = (data: DataPoint[]): DataPoint[] => {
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  return data.map(point => ({
    ...point,
    value: (point.value - min) / range,
  }));
};