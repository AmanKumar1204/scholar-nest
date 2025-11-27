'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ImageData, RoomType } from '@/lib/validations/property';

// Dynamically import components to avoid SSR issues
const ImageUploader = dynamic(() => import('../../components/ImageUploader'), { ssr: false });
const MapPicker = dynamic(() => import('../../components/MapPicker'), { ssr: false });
const RoomTypeManager = dynamic(() => import('../../components/RoomTypeManager'), { ssr: false });

type PropertyType = 'Shared Room' | 'Single Room' | 'Apartment' | 'PG' | 'Hostel' | 'Flat';
type FurnishingStatus = 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';
type PreferredTenants = 'Students' | 'Working Professionals' | 'Family' | 'Any';
type GenderPreference = 'Male' | 'Female' | 'Any';
type FoodType = 'Vegetarian' | 'Non-Vegetarian' | 'Both' | 'Not Provided';

export default function UploadPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Basic Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('PG');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');

  // Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [nearbyCollege, setNearbyCollege] = useState('');

  // Additional Details
  const [furnishingStatus, setFurnishingStatus] = useState<FurnishingStatus>('Unfurnished');
  const [preferredTenants, setPreferredTenants] = useState<PreferredTenants>('Any');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [maintenanceCharges, setMaintenanceCharges] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const availableAmenities = [
    'WiFi', 'AC', 'Parking', 'Security', 'Laundry', 'Mess', 
    'Kitchen', 'Study Area', 'Gym', 'Power Backup', 'Water Supply', 'Elevator'
  ];

  // Gender Preference
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('Any');
  
  // Food Options
  const [foodIncluded, setFoodIncluded] = useState(false);
  const [foodType, setFoodType] = useState<FoodType>('Not Provided');
  const [mealsProvided, setMealsProvided] = useState<string[]>([]);
  
  // Room Types
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  
  // Images
  const [images, setImages] = useState<ImageData[]>([]);
  
  // Location Coordinates
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // House Rules
  const [houseRules, setHouseRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');

  // Landlord Info (would typically come from session)
  const [landlordName, setLandlordName] = useState('');
  const [landlordEmail, setLandlordEmail] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');

  useEffect(() => {
    // Get user info from localStorage (in production, use session)
    const userName = localStorage.getItem('userName') || 'Demo Landlord';
    const userEmail = localStorage.getItem('userEmail') || 'landlord@demo.com';
    setLandlordName(userName);
    setLandlordEmail(userEmail);
  }, [router]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleMeal = (meal: string) => {
    setMealsProvided(prev =>
      prev.includes(meal)
        ? prev.filter(m => m !== meal)
        : [...prev, meal]
    );
  };

  const addHouseRule = () => {
    if (newRule.trim()) {
      setHouseRules(prev => [...prev, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeHouseRule = (index: number) => {
    setHouseRules(prev => prev.filter((_, i) => i !== index));
  };

  const handleImagesChange = (uploadedImages: ImageData[]) => {
    setImages(uploadedImages);
  };

  const handleLocationSelect = (location: { latitude: number; longitude: number; address?: string; city?: string; state?: string; pincode?: string }) => {
    setCoordinates({ latitude: location.latitude, longitude: location.longitude });
    // Optionally auto-fill address fields
    if (location.city && !city) setCity(location.city);
    if (location.state && !state) setState(location.state);
    if (location.pincode && !pincode) setPincode(location.pincode);
  };

  const handleRoomTypesChange = (types: RoomType[]) => {
    setRoomTypes(types);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!title || !description || !price || !bedrooms || !bathrooms || 
          !address || !city || !state || !pincode) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      if (!landlordName || !landlordEmail) {
        setError('Landlord information is missing. Please login again.');
        setIsSubmitting(false);
        return;
      }

      // Prepare property data
      const propertyData = {
        title,
        description,
        propertyType,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: area ? parseFloat(area) : undefined,
        address,
        city,
        state,
        pincode,
        nearbyCollege: nearbyCollege || undefined,
        coordinates: coordinates || undefined,
        amenities: selectedAmenities,
        images: images,
        mainImage: images.find(img => img.isMain)?.url || (images.length > 0 ? images[0].url : undefined),
        landlordId: '000000000000000000000000', // Placeholder - should come from session
        landlordName,
        landlordEmail,
        landlordPhone: landlordPhone || undefined,
        furnishingStatus,
        preferredTenants,
        genderPreference,
        foodIncluded,
        foodType: foodIncluded ? foodType : 'Not Provided',
        mealsProvided: foodIncluded ? mealsProvided : [],
        roomTypes,
        houseRules,
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : undefined,
        maintenanceCharges: maintenanceCharges ? parseFloat(maintenanceCharges) : undefined,
        availableFrom: availableFrom || undefined,
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Property uploaded successfully!');
        // Reset form
        setTimeout(() => {
          router.push('/properties');
        }, 2000);
      } else {
        setError(data.error || 'Failed to upload property');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Upload Property</h1>
            <p className="mt-2 text-gray-600">Fill in the details to list your property</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Comfortable PG near DU"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your property..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Shared Room">Shared Room</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Apartment">Apartment</option>
                    <option value="PG">PG</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Flat">Flat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Delhi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Delhi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="110001"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nearby College/University
                  </label>
                  <input
                    type="text"
                    value={nearbyCollege}
                    onChange={(e) => setNearbyCollege(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Delhi University"
                  />
                </div>
              </div>
            </div>

            {/* Property Images */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Images</h2>
              <ImageUploader images={images} onChange={handleImagesChange} maxImages={10} />
            </div>

            {/* Location Map */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Location on Map</h2>
              <MapPicker onLocationSelect={handleLocationSelect} />
              {coordinates && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                </p>
              )}
            </div>

            {/* Gender Preference */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gender Preference</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={genderPreference === 'Male'}
                    onChange={(e) => setGenderPreference(e.target.value as GenderPreference)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Boys Only</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={genderPreference === 'Female'}
                    onChange={(e) => setGenderPreference(e.target.value as GenderPreference)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Girls Only</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="gender"
                    value="Any"
                    checked={genderPreference === 'Any'}
                    onChange={(e) => setGenderPreference(e.target.value as GenderPreference)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Both</span>
                </label>
              </div>
            </div>

            {/* Room Types */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Types & Capacity</h2>
              <RoomTypeManager roomTypes={roomTypes} onChange={handleRoomTypesChange} />
            </div>

            {/* Food Options */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Food Options</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodIncluded}
                    onChange={(e) => setFoodIncluded(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Food Included</span>
                </label>

                {foodIncluded && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Food Type
                      </label>
                      <select
                        value={foodType}
                        onChange={(e) => setFoodType(e.target.value as FoodType)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meals Provided
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                          <label
                            key={meal}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={mealsProvided.includes(meal)}
                              onChange={() => toggleMeal(meal)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{meal}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">House Rules</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHouseRule())}
                    placeholder="Add a house rule (e.g., No smoking)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addHouseRule}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
                {houseRules.length > 0 && (
                  <div className="space-y-2">
                    {houseRules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{rule}</span>
                        <button
                          type="button"
                          onClick={() => removeHouseRule(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnishing Status
                  </label>
                  <select
                    value={furnishingStatus}
                    onChange={(e) => setFurnishingStatus(e.target.value as FurnishingStatus)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Tenants
                  </label>
                  <select
                    value={preferredTenants}
                    onChange={(e) => setPreferredTenants(e.target.value as PreferredTenants)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Students">Students</option>
                    <option value="Working Professionals">Working Professionals</option>
                    <option value="Family">Family</option>
                    <option value="Any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={maintenanceCharges}
                    onChange={(e) => setMaintenanceCharges(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From
                  </label>
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Landlord Contact */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={landlordName}
                    onChange={(e) => setLandlordName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    required
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={landlordEmail}
                    onChange={(e) => setLandlordEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    required
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={landlordPhone}
                    onChange={(e) => setLandlordPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Uploading...' : 'Upload Property'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
