// src/App.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './styles.css';

// Context for managing profiles
const ProfileContext = createContext();

// ProfileProvider component to handle profile data state and actions
const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    // Fetch profiles from a mock API or local data
    const fetchProfiles = async () => {
      // Mock data, replace with actual API call
      const data = [
        { id: 1, name: 'John Doe', description: 'Developer', address: 'New York, NY', photo: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Jane Smith', description: 'Designer', address: 'Los Angeles, CA', photo: 'https://via.placeholder.com/100' },
      ];
      setProfiles(data);
      setFilteredProfiles(data);
    };

    fetchProfiles();
  }, []);

  const addProfile = (profile) => setProfiles([...profiles, profile]);
  const updateProfile = (updatedProfile) => setProfiles(profiles.map(profile => profile.id === updatedProfile.id ? updatedProfile : profile));
  const deleteProfile = (id) => setProfiles(profiles.filter(profile => profile.id !== id));

  return (
    <ProfileContext.Provider value={{ profiles, filteredProfiles, setFilteredProfiles, addProfile, updateProfile, deleteProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Main App component
const App = () => {
  return (
    <ProfileProvider>
      <div className="app-container">
        <h1>Profile Mapping Application</h1>
        <SearchFilter />
        <ProfileList />
        <AdminPanel />
      </div>
    </ProfileProvider>
  );
};

// ProfileList component to display a list of profiles
const ProfileList = () => {
  const { filteredProfiles } = useContext(ProfileContext);

  return (
    <div className="profile-list">
      {filteredProfiles.map(profile => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
};

// ProfileCard component to display individual profile information
const ProfileCard = ({ profile }) => {
  const [showMap, setShowMap] = useState(false);

  const handleSummaryClick = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="profile-card">
      <img src={profile.photo} alt={profile.name} />
      <h2>{profile.name}</h2>
      <p>{profile.description}</p>
      <button onClick={handleSummaryClick}>Summary</button>
      {showMap && <MapView address={profile.address} />}
    </div>
  );
};

// MapView component to display Google Map with a marker for the address
const MapView = ({ address }) => {
  const mapStyles = {
    height: "400px",
    width: "100%"
  };

  const defaultCenter = {
    lat: 34.0522, lng: -118.2437 // Replace with geocoded location based on address
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

// AdminPanel component to add new profiles
const AdminPanel = () => {
  const { addProfile } = useContext(ProfileContext);
  const [newProfile, setNewProfile] = useState({ name: '', description: '', address: '', photo: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProfile({ ...newProfile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProfile({ ...newProfile, id: Date.now() });
    setNewProfile({ name: '', description: '', address: '', photo: '' });
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={newProfile.name} onChange={handleChange} placeholder="Name" required />
        <input name="description" value={newProfile.description} onChange={handleChange} placeholder="Description" required />
        <input name="address" value={newProfile.address} onChange={handleChange} placeholder="Address" required />
        <input name="photo" value={newProfile.photo} onChange={handleChange} placeholder="Photo URL" required />
        <button type="submit">Add Profile</button>
      </form>
    </div>
  );
};

// SearchFilter component to filter profiles based on search criteria
const SearchFilter = () => {
  const { profiles, setFilteredProfiles } = useContext(ProfileContext);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = profiles.filter(profile => profile.name.toLowerCase().includes(term));
    setFilteredProfiles(filtered);
  };

  return (
    <input
      type="text"
      placeholder="Search profiles..."
      value={searchTerm}
      onChange={handleSearch}
      className="search-filter"
    />
  );
};

export default App;
