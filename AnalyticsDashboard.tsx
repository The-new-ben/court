import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import { calculateAnalytics, AnalyticsMetrics } from './src/services/analyticsService';

ChartJS.register(ArcElement, Tooltip, Legend);

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);

  useEffect(() => {
    calculateAnalytics().then(setMetrics);
  }, []);

  if (!metrics) {
    return <div>Loading analytics...</div>;
  }

  const outcomeData = {
    labels: Object.keys(metrics.outcomeCounts),
    datasets: [
      {
        data: Object.values(metrics.outcomeCounts),
        backgroundColor: ['#4ade80', '#f87171', '#60a5fa', '#facc15', '#a78bfa'],
      },
    ],
  };

  const exportCSV = () => {
    const rows: string[][] = [
      ['Average Duration', metrics.averageDuration.toFixed(2)],
      ['Total Compliance Violations', metrics.totalComplianceViolations.toString()],
      ['Outcome', 'Count'],
      ...Object.entries(metrics.outcomeCounts).map(([outcome, count]) => [outcome, count.toString()]),
    ];
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analytics.csv');
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Average Duration: ${metrics.averageDuration.toFixed(2)}`, 10, 10);
    doc.text(`Total Compliance Violations: ${metrics.totalComplianceViolations}`, 10, 20);
    let y = 30;
    Object.entries(metrics.outcomeCounts).forEach(([outcome, count]) => {
      doc.text(`${outcome}: ${count}`, 10, y);
      y += 10;
    });
    doc.save('analytics.pdf');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="mb-4">Average Case Duration: {metrics.averageDuration.toFixed(2)} mins</div>
      <div className="mb-4">Total Compliance Violations: {metrics.totalComplianceViolations}</div>
      <div className="w-64 h-64">
        <Pie data={outcomeData} />
      </div>
      <div className="mt-4 space-x-2">
        <button onClick={exportCSV} className="px-4 py-2 bg-blue-500 text-white rounded">Export CSV</button>
        <button onClick={exportPDF} className="px-4 py-2 bg-green-500 text-white rounded">Export PDF</button>
      </div>
    </div>
  );
}
