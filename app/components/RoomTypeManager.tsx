'use client';

import { useState } from 'react';
import { RoomType } from '@/lib/validations/property';

interface RoomTypeManagerProps {
  roomTypes: RoomType[];
  onChange: (roomTypes: RoomType[]) => void;
}

export default function RoomTypeManager({ roomTypes, onChange }: RoomTypeManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoomType, setNewRoomType] = useState<RoomType>({
    type: 'Single',
    capacity: 1,
    occupied: 0,
    pricePerBed: 0,
  });

  const handleAddRoomType = () => {
    onChange([...roomTypes, newRoomType]);
    setNewRoomType({
      type: 'Single',
      capacity: 1,
      occupied: 0,
      pricePerBed: 0,
    });
    setShowAddForm(false);
  };

  const handleRemoveRoomType = (index: number) => {
    onChange(roomTypes.filter((_, i) => i !== index));
  };

  const handleUpdateRoomType = (index: number, field: keyof RoomType, value: string | number) => {
    const updated = roomTypes.map((rt, i) => 
      i === index ? { ...rt, [field]: value } : rt
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Room Types</h3>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : '+ Add Room Type'}
        </button>
      </div>

      {/* Existing Room Types */}
      <div className="space-y-3">
        {roomTypes.map((roomType, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  value={roomType.type}
                  onChange={(e) => handleUpdateRoomType(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Dormitory">Dormitory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (Beds)
                </label>
                <input
                  type="number"
                  min="1"
                  value={roomType.capacity}
                  onChange={(e) => handleUpdateRoomType(index, 'capacity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currently Occupied
                </label>
                <input
                  type="number"
                  min="0"
                  max={roomType.capacity}
                  value={roomType.occupied}
                  onChange={(e) => handleUpdateRoomType(index, 'occupied', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Bed (₹/month)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={roomType.pricePerBed}
                    onChange={(e) => handleUpdateRoomType(index, 'pricePerBed', parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRoomType(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Available: {roomType.capacity - roomType.occupied} beds
            </div>
          </div>
        ))}
      </div>

      {/* Add New Room Type Form */}
      {showAddForm && (
        <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
          <h4 className="font-semibold mb-3">Add New Room Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                value={newRoomType.type}
                onChange={(e) => setNewRoomType({ ...newRoomType, type: e.target.value as 'Single' | 'Double' | 'Triple' | 'Dormitory' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (Beds)
              </label>
              <input
                type="number"
                min="1"
                value={newRoomType.capacity}
                onChange={(e) => setNewRoomType({ ...newRoomType, capacity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currently Occupied
              </label>
              <input
                type="number"
                min="0"
                max={newRoomType.capacity}
                value={newRoomType.occupied}
                onChange={(e) => setNewRoomType({ ...newRoomType, occupied: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Bed (₹/month)
              </label>
              <input
                type="number"
                min="0"
                value={newRoomType.pricePerBed}
                onChange={(e) => setNewRoomType({ ...newRoomType, pricePerBed: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddRoomType}
            className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Room Type
          </button>
        </div>
      )}

      {roomTypes.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-gray-500">
          No room types added yet. Click &quot;Add Room Type&quot; to get started.
        </div>
      )}
    </div>
  );
}

