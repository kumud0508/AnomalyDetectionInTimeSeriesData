"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot
} from "recharts";
import { motion } from "framer-motion";
import Slider from "@/components/ui/slider";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useAnomalyStore } from "@/store/anomalyStore";
import { parseCSV, parseJSON } from "@/utils/dataParsers";
import { generateMovingAverage, detectAnomalies } from "@/utils/anomalyUtils";
import { fetchAIInsights, Insight } from "@/utils/aiInsights";
import { toast } from "sonner";

const Dashboard = () => {
  const { data, setData } = useAnomalyStore();
  const [threshold, setThreshold] = useState(1.5);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [liveMode, setLiveMode] = useState(false);
  const [aiInsights, setAiInsights] = useState<Insight[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Simulate live mode
  useEffect(() => {
    if (liveMode) {
      const interval = setInterval(() => {
        console.log("Live mode: Fetching real-time data...");
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [liveMode]);

  // Update insights when data changes
  useEffect(() => {
    if (data.length) {
      const insights = fetchAIInsights(data);
      setAiInsights(insights);
    }
  }, [data]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    try {
      const content = await file.text();
      const parsedData = file.name.endsWith(".csv") ? parseCSV(content) : parseJSON(content);
      setData(parsedData);
      toast.success("Dataset uploaded successfully!");
    } catch (error) {
      toast.error("Failed to parse the file.");
    }
  };

  const processedData = useMemo(() => generateMovingAverage(data), [data]);
  const anomalies = useMemo(() => detectAnomalies(processedData, threshold), [processedData, threshold]);

  return (
    <motion.div
      className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          📊 Anomaly Detection Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Upload datasets, monitor patterns, and detect anomalies with ease.
        </p>
      </div>

      {/* File Upload */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
        <label className="font-semibold text-gray-700 dark:text-gray-300">Upload Dataset (CSV / JSON):</label>
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileUpload}
          className="mt-2 w-full cursor-pointer text-sm file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploadedFile && <p className="text-sm text-gray-500 mt-1">📁 {uploadedFile.name}</p>}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Model Selection */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Select Models:</label>
          <Select value={selectedModels[0]} onValueChange={(value) => setSelectedModels([value])}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Model A">Model A</SelectItem>
              <SelectItem value="Model B">Model B</SelectItem>
              <SelectItem value="Model C">Model C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Threshold Slider */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Anomaly Threshold: {threshold}
          </label>
          <Slider
            min={0.5}
            max={5}
            step={0.1}
            value={threshold}
            onChange={(value) => setThreshold(value)}
          />
        </div>

        {/* Live Mode */}
        <div className="flex items-center mt-6">
          <label className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
            <input
              type="checkbox"
              checked={liveMode}
              onChange={() => setLiveMode(!liveMode)}
              className="accent-blue-600"
            />
            Enable Live Monitoring
          </label>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">📈 Time Series Visualization</h2>
        {!data.length ? (
          <p className="text-center text-gray-500">No data loaded</p>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="movingAvg" stroke="#22c55e" strokeDasharray="5 5" dot={false} />
                {anomalies.map((a, idx) => (
                  <ReferenceDot key={idx} x={a.timestamp} y={a.value} r={6} fill="#dc2626" stroke="#dc2626" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">🧠 AI-Generated Insights</h2>
        <div className="text-gray-700 dark:text-gray-300">
          {aiInsights.length > 0 ? (
            aiInsights.map((insight, index) => (
              <div key={index} className="mb-2">
                {insight.message}
              </div>
            ))
          ) : (
            "Analyzing data..."
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;