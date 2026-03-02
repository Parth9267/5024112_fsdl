import React, { useState } from 'react';
import './BookingForm.css';

const BookingForm = ({ vehicle, onBook }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook({ vehicle, name, startDate, endDate });
    setName('');
    setStartDate('');
    setEndDate('');
  };

  if (!vehicle) {
    return <p>Please select a vehicle to book.</p>;
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>
        {vehicle.action === 'rent' ? 'Rent' : 'Buy'} {vehicle.name}
      </h2>
      <div>
        <label>
          Your name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      {vehicle.action === 'rent' && (
        <>
          <div>
            <label>
              Start date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              End date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </label>
          </div>
        </>
      )}
      <button type="submit">Confirm Booking</button>
    </form>
  );
};

export default BookingForm;
