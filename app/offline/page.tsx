'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, Upload, Database } from 'lucide-react';

interface OfflineData {
  mood: any[];
  activities: any[];
  medications: any[];
  lastSync: string;
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    mood: [],
    activities: [],
    medications: [],
    lastSync: new Date().toISOString()
  });
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data
    const stored = localStorage.getItem('offlineData');
    if (stored) {
      setOfflineData(JSON.parse(stored));
    }

    // Check pending sync items
    const pending = localStorage.getItem('pendingSync');
    if (pending) {
      setPendingSync(JSON.parse(pending).length);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const downloadOfflineData = () => {
    // Simulate downloading essential data for offline use
    const essentialData = {
      medications: [
        { id: '1', name: 'Ritalin', dosage: '10mg', times: ['08:00', '14:00'] }
      ],
      emergencyContacts: [
        { name: 'Dr. Johnson', phone: '911' },
        { name: 'Mom', phone: '+1-555-0123' }
      ],
      routines: [
        { id: '1', name: 'Morning Routine', time: '07:00' }
      ]
    };

    localStorage.setItem('offlineEssentials', JSON.stringify(essentialData));
    alert('Essential data downloaded for offline use');
  };

  const syncData = async () => {
    if (!isOnline) {
      alert('Cannot sync while offline');
      return;
    }

    // Simulate syncing pending data
    const pending = localStorage.getItem('pendingSync');
    if (pending) {
      const pendingItems = JSON.parse(pending);
      
      // In real app, would send to backend
      console.log('Syncing:', pendingItems);
      
      localStorage.removeItem('pendingSync');
      setPendingSync(0);
      
      setOfflineData(prev => ({
        ...prev,
        lastSync: new Date().toISOString()
      }));
      
      alert('Data synced successfully');
    }
  };

  const addOfflineEntry = (type: string, data: any) => {
    // Add to pending sync queue
    const pending = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    pending.push({ type, data, timestamp: new Date().toISOString() });
    localStorage.setItem('pendingSync', JSON.stringify(pending));
    setPendingSync(pending.length);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Offline Mode
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage offline functionality and data synchronization
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            {isOnline ? (
              <Wifi className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
            ) : (
              <WifiOff className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connection Status
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Status</span>
              <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Last Sync</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(offlineData.lastSync).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Pending Items</span>
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {pendingSync}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Offline Actions
            </h3>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={downloadOfflineData}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Essential Data
            </button>
            
            <button
              onClick={syncData}
              disabled={!isOnline || pendingSync === 0}
              className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg flex items-center justify-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Sync Pending Data
            </button>
            
            <button
              onClick={() => addOfflineEntry('mood', { score: 8, date: new Date() })}
              className="w-full p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
            >
              Test Offline Entry
            </button>
          </div>
        </div>

        <div className="md:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Offline Features Available
          </h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Emergency Contacts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Access emergency numbers and medical info
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Medication Reminders</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Local notifications for medication times
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Focus Activities</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Play games and track scores locally
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}