'use client';

import { useState } from 'react';
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';

interface ReportData {
  period: string;
  mood: { date: string; score: number }[];
  activities: { name: string; score: number; date: string }[];
  medications: { name: string; adherence: number }[];
  insights: string[];
}

export default function ReportsPage() {
  const [reportData] = useState<ReportData>({
    period: 'Last 30 Days',
    mood: [
      { date: '2024-01-01', score: 8 },
      { date: '2024-01-02', score: 7 },
      { date: '2024-01-03', score: 9 }
    ],
    activities: [
      { name: 'Math Game', score: 85, date: '2024-01-01' },
      { name: 'Memory Match', score: 92, date: '2024-01-02' }
    ],
    medications: [
      { name: 'Ritalin', adherence: 95 }
    ],
    insights: [
      'Mood scores show consistent improvement',
      'Focus activities performance above average',
      'Medication adherence excellent'
    ]
  });

  const generatePDF = () => {
    const reportContent = `
YOSELLINS PROGRESS REPORT
${reportData.period}

MOOD TRACKING
Average Score: ${(reportData.mood.reduce((sum, m) => sum + m.score, 0) / reportData.mood.length).toFixed(1)}/10
Trend: Improving

ACTIVITY PERFORMANCE
${reportData.activities.map(a => `${a.name}: ${a.score}%`).join('\n')}

MEDICATION ADHERENCE
${reportData.medications.map(m => `${m.name}: ${m.adherence}%`).join('\n')}

AI INSIGHTS
${reportData.insights.map(i => `• ${i}`).join('\n')}

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareWithDoctor = () => {
    const subject = 'Yosellins Progress Report';
    const body = `Please find attached the latest progress report from Yosellins app.`;
    window.open(`mailto:doctor@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Progress Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Generate comprehensive reports for healthcare providers
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
          <button
            onClick={shareWithDoctor}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mood Trends
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Average Score</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(reportData.mood.reduce((sum, m) => sum + m.score, 0) / reportData.mood.length).toFixed(1)}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(reportData.mood.reduce((sum, m) => sum + m.score, 0) / reportData.mood.length) * 10}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Activity Performance
            </h3>
          </div>
          <div className="space-y-3">
            {reportData.activities.map((activity, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">{activity.name}</span>
                <span className="font-medium text-gray-900 dark:text-white">{activity.score}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Medication Adherence
          </h3>
          <div className="space-y-3">
            {reportData.medications.map((med, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">{med.name}</span>
                <span className="font-medium text-green-600 dark:text-green-400">{med.adherence}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Insights
          </h3>
          <div className="space-y-2">
            {reportData.insights.map((insight, index) => (
              <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
                • {insight}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}