import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import type { DataPoint } from '../store/anomalyStore';

/**
 * Export a DOM element to PDF
 * @param elementId - The ID of the HTML element to export
 * @param filename - Desired filename for the PDF
 */
export const exportToPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with ID '${elementId}' not found.`);
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality rendering
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename || 'document'}.pdf`);
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
};

/**
 * Export data to CSV
 * @param data - Array of data points
 * @param filename - Desired filename for the CSV
 */
export const exportToCSV = (data: DataPoint[], filename: string) => {
  try {
    const csvData = data.map(({ timestamp, value, isAnomaly, feedback }) => ({
      timestamp,
      value,
      isAnomaly,
      feedback: feedback || 'none',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename || 'data'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export CSV:', error);
  }
};
