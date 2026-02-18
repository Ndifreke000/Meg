'use client';

import { useState } from 'react';
import { Phone, AlertTriangle, MapPin, Clock } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

export default function EmergencyPage() {
  const [contacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Dr. Sarah Johnson', phone: '911', relationship: 'Primary Doctor', priority: 1 },
    { id: '2', name: 'Mom - Lisa', phone: '+1-555-0123', relationship: 'Parent', priority: 2 },
    { id: '3', name: 'Dad - Mike', phone: '+1-555-0124', relationship: 'Parent', priority: 3 },
    { id: '4', name: 'Emergency Services', phone: '911', relationship: 'Emergency', priority: 0 }
  ]);

  const [alertSent, setAlertSent] = useState(false);

  const handleEmergencyCall = (contact: EmergencyContact) => {
    window.open(`tel:${contact.phone}`);
    setAlertSent(true);
    
    const emergencyLog = {
      timestamp: new Date().toISOString(),
      contact: contact.name,
      phone: contact.phone,
      location: 'Current Location'
    };
    
    localStorage.setItem('lastEmergency', JSON.stringify(emergencyLog));
    setTimeout(() => setAlertSent(false), 3000);
  };

  const sendLocationAlert = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = `${position.coords.latitude},${position.coords.longitude}`;
        alert(`Location shared: ${location}`);
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Emergency Contacts
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Quick access to emergency contacts and medical information
        </p>
      </div>

      {alertSent && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">Emergency alert sent!</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Emergency Contacts
          </h2>
          
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {contact.relationship}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {contact.phone}
                  </p>
                </div>
                <button
                  onClick={() => handleEmergencyCall(contact)}
                  className={`p-3 rounded-full ${
                    contact.priority === 0 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors`}
                >
                  <Phone className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          
          <button
            onClick={sendLocationAlert}
            className="w-full p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <MapPin className="h-5 w-5 mr-2" />
            Share Location
          </button>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Medical Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Allergies:</strong> Peanuts, Shellfish</p>
              <p><strong>Medications:</strong> Ritalin 10mg</p>
              <p><strong>Conditions:</strong> ADHD, Autism Spectrum</p>
              <p><strong>Blood Type:</strong> O+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}