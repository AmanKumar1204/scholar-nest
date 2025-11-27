'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  nearbyCollege?: string;
  amenities: string[];
  images: Array<{ url: string; isMain: boolean }>;
  mainImage?: string;
  genderPreference?: string;
  furnishingStatus: string;
  preferredTenants: string;
  landlordName: string;
  landlordPhone?: string;
  availableFrom?: string;
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
}

export default function UserPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchCity, setSearchCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (filters?: {
    city?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    gender?: string;
  }) => {
    try {
      setLoading(true);
      setError('');

      // Build query string
      const params = new URLSearchParams();
      if (filters?.city) params.append('city', filters.city);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice);
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters?.gender) params.append('gender', filters.gender);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProperties(data.properties);
      } else {
        setError(data.error || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('An error occurred while fetching properties');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProperties({
      city: searchCity,
      type: propertyType,
      minPrice,
      maxPrice,
      gender: genderFilter,
    });
  };

  const handleReset = () => {
    setSearchCity('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setGenderFilter('');
    fetchProperties();
  };

  const getPropertyImage = (property: Property) => {
    if (property.mainImage) return property.mainImage;
    if (property.images && property.images.length > 0) {
      const mainImg = property.images.find(img => img.isMain);
      return mainImg ? mainImg.url : property.images[0].url;
    }
    return '/placeholder-property.jpg';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
              <p className="mt-1 text-gray-600">Find your perfect accommodation</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Search & Filter</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* City Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="e.g., Delhi, Mumbai"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Property Type */}
              <div className="relative z-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
                  style={{ 
                    appearance: 'menulist',
                    WebkitAppearance: 'menulist',
                    MozAppearance: 'menulist'
                  }}
                >
                  <option value="" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>All Types</option>
                  <option value="PG" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>PG</option>
                  <option value="Hostel" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>Hostel</option>
                  <option value="Shared Room" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>Shared Room</option>
                  <option value="Single Room" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>Single Room</option>
                  <option value="Apartment" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>Apartment</option>
                  <option value="Flat" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>Flat</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div className="relative z-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
                  style={{ 
                    appearance: 'menulist',
                    WebkitAppearance: 'menulist',
                    MozAppearance: 'menulist'
                  }}
                >
                  <option value="" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>All</option>
                  <option value="Male" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>Boys</option>
                  <option value="Female" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>Girls</option>
                  <option value="Any" style={{ backgroundColor: 'white', color: 'black', padding: '8px' }}>Both</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="20000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Search
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-gray-900">{properties.length}</span> properties
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search filters</p>
          </div>
        )}

        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={getPropertyImage(property)}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                    ₹{property.price.toLocaleString()}/mo
                  </div>
                  {property.genderPreference && property.genderPreference !== 'Any' && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {property.genderPreference === 'Male' ? 'Boys' : 'Girls'}
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {property.propertyType}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {property.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="line-clamp-1">{property.city}, {property.state}</span>
                  </div>

                  {/* Nearby College */}
                  {property.nearbyCollege && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                      <span className="line-clamp-1">Near {property.nearbyCollege}</span>
                    </div>
                  )}

                  {/* Property Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                      </svg>
                      <span>{property.bathrooms} Baths</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Rating */}
                  {property.totalReviews > 0 && (
                    <div className="flex items-center mb-3">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="text-sm font-semibold text-gray-900">
                        {property.averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        ({property.totalReviews} reviews)
                      </span>
                    </div>
                  )}

                  {/* View Details Button */}
                  <Link
                    href={`/user/properties/${property._id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
