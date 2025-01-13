import React from 'react';
import { Mail, Phone, MapPin, Calendar, User, Edit, Save } from 'lucide-react';

const InfoItem = ({ icon, label, value, isEditing, name, onChange, type = 'text' }) => (
  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
    <div className="text-gray-400">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-sm text-gray-900">{value || 'Non défini'}</p>
      )}
    </div>
  </div>
);

export default InfoItem;