"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { motion } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

const anomalyDistribution = [
  { name: "CPU Spikes", value: 35 },
  { name: "Memory Leaks", value: 25 },
  { name: "Network Issues", value: 20 },
  { name: "Disk I/O", value: 15 },
  { name: "Other", value: 5 },
];

const weeklyTrends = [
  { day: "Mon", anomalies: 12 },
  { day: "Tue", anomalies: 19 },
  { day: "Wed", anomalies: 15 },
  { day: "Thu", anomalies: 22 },
  { day: "Fri", anomalies: 18 },
  { day: "Sat", anomalies: 8 },
  { day: "Sun", anomalies: 10 },
];

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#84cc16"];

const metrics = [
  { title: "Detection Accuracy", value: "97.8%", delta: "+2.1%", color: "blue" },
  { title: "Avg Response Time", value: "1.2s", delta: "-0.3s", color: "purple" },
  { title: "False Positive Rate", value: "2.3%", delta: "-0.5%", color: "pink" }
];

function MetricCard({ title, value, delta, color }: { title: string, value: string, delta: string, color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-5 rounded-xl transition-all shadow-sm hover:shadow-md ${
        color === "blue" ? "bg-blue-50 text-blue-700" :
        color === "purple" ? "bg-purple-50 text-purple-700" :
        "bg-pink-50 text-pink-700"
      }`}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm mt-1">{delta} from last week</p>
    </motion.div>
  );
}

export default function Analytics() {
  const [selectedRange, setSelectedRange] = useState("7days");
  const totalAnomalies = anomalyDistribution.reduce((acc, curr) => acc + curr.value, 0);

  const getRangeLabel = () => {
    switch (selectedRange) {
      case "7d": return "this week";
      case "30d": return "this month";
      case "custom": return "in custom range";
      default: return "";
    }
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-10 space-y-1">
        <h1 className="text-4xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
        <p className="text-lg text-gray-600">Insightful patterns & metrics on anomaly detection</p>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-xl shadow-inner"
      >
        <h3 className="text-xl font-semibold text-blue-900">
          Total Anomalies Detected: {totalAnomalies}
        </h3>
        <p className="text-sm text-blue-700 mt-1">Across all categories {getRangeLabel()}</p>
      </motion.div>

      {/* Time Range Filter */}
      <div className="flex justify-end mb-8">
        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Bar Chart */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📈 Weekly Anomaly Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="anomalies" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🥧 Anomaly Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={anomalyDistribution}
                  cx="50%" cy="50%" outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                  dataKey="value"
                >
                  {anomalyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Metrics Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800">📌 Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}