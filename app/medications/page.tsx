'use client';

import { useState, useEffect } from 'react';
import { Pill, Clock, Plus, Bell } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  taken: { [key: string]: boolean };
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Ritalin',
      dosage: '10mg',
      times: ['08:00', '14:00'],
      taken: {}
    }
  ]);

  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const today = now.toDateString();

      medications.forEach(med => {
        med.times.forEach(time => {
          const key = `${med.id}-${today}-${time}`;
          if (time === currentTime && !med.taken[key]) {
            setNotifications(prev => [...prev, `Time for ${med.name} ${med.dosage}`]);
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Medication Reminder`, {
                body: `Time for ${med.name} ${med.dosage}`,
                icon: '/pill-icon.png'
              });
            }
          }
        });
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [medications]);

  const markTaken = (medId: string, time: string) => {
    const today = new Date().toDateString();
    const key = `${medId}-${today}-${time}`;
    
    setMedications(prev => prev.map(med => 
      med.id === medId 
        ? { ...med, taken: { ...med.taken, [key]: true } }
        : med
    ));
    
    setNotifications(prev => prev.filter(n => !n.includes(medications.find(m => m.id === medId)?.name || '')));
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Medications
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track medication schedules and reminders
          </p>
        </div>
        <button
          onClick={requestNotificationPermission}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
        >
          <Bell className="h-4 w-4 mr-2" />
          Enable Alerts
        </button>
      </div>

      {notifications.length > 0 && (
        <div className="mb-6 space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="text-yellow-800 dark:text-yellow-200">{notification}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {medications.map((medication) => (
          <div key={medication.id} className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Pill className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {medication.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{medication.dosage}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {medication.times.map((time) => {
                const today = new Date().toDateString();
                const key = `${medication.id}-${today}-${time}`;
                const isTaken = medication.taken[key];

                return (
                  <div key={time} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">{time}</span>
                    </div>
                    <button
                      onClick={() => markTaken(medication.id, time)}
                      disabled={isTaken}
                      className={`px-3 py-1 rounded text-sm ${
                        isTaken
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isTaken ? 'Taken' : 'Mark Taken'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}