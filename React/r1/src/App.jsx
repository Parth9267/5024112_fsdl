import { useState } from 'react';
import './App.css';
import VehicleCard from './components/VehicleCard';
import BookingForm from './components/BookingForm';
import LuxuryLanding from './components/LuxuryLanding';
import PremiumLanding from './components/PremiumLanding';

const vehiclesData = [
  {
    id: 1,
    name: 'Sedan LX',
    type: 'Sedan',
    price: 40,
    image: 'https://source.unsplash.com/featured/?sedan',
    condition: 'new', // new or used
    action: 'rent', // rent or buy
  },
  {
    id: 2,
    name: 'SUV Explorer',
    type: 'SUV',
    price: 65,
    image: 'https://source.unsplash.com/featured/?suv',
    condition: 'used',
    action: 'rent',
  },
  {
    id: 3,
    name: 'Compact Eco',
    type: 'Compact',
    price: 30,
    image: 'https://source.unsplash.com/featured/?compact-car',
    condition: 'new',
    action: 'buy',
  },
  {
    id: 4,
    name: 'Luxury Convertible',
    type: 'Convertible',
    price: 120,
    image: 'https://source.unsplash.com/featured/?convertible',
    condition: 'used',
    action: 'buy',
  },
];

function App() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [conditionFilter, setConditionFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const handleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBook = (booking) => {
    setBookings((prev) => [...prev, booking]);
    const actionWord = booking.vehicle.action === 'rent' ? 'rental' : 'purchase';
    alert(`Confirmed ${actionWord} for ${booking.name} (${booking.vehicle.name})`);
    setSelectedVehicle(null);
  };

  const filteredVehicles = vehiclesData.filter((v) => {
    const condMatch = conditionFilter === 'all' || v.condition === conditionFilter;
    const actionMatch = actionFilter === 'all' || v.action === actionFilter;
    return condMatch && actionMatch;
  });

  return (
    <div id="root">
      <PremiumLanding />
      {/* existing booking interface below if you want to preserve it */}
      <LuxuryLanding />
      <header className="header">
        <h1>CARX Vehicle Booking</h1>
        <p>Your trusted site for new, used, rent- or buy-ready cars 🚗</p>
      </header>

      <div className="filters">
        <label>
          Condition:
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </label>
        <label>
          Action:
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
          </select>
        </label>
      </div>

      <div className="vehicles-container">
        {filteredVehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} onSelect={handleSelect} />
        ))}
      </div>
      <BookingForm vehicle={selectedVehicle} onBook={handleBook} />
      {bookings.length > 0 && (
        <div className="booking-history">
          <h2>Previous Bookings</h2>
          <ul>
            {bookings.map((b, idx) => (
              <li key={idx}>
                      {b.name} {b.vehicle.action === 'rent' ? 'rented' : 'bought'} {b.vehicle.name}
                {b.vehicle.action === 'rent' && (<> from {b.startDate} to {b.endDate}</>)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
