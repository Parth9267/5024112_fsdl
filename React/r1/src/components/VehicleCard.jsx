import React from 'react';
import './VehicleCard.css';

const VehicleCard = ({ vehicle, onSelect }) => {
  return (
    <div className="vehicle-card" onClick={() => onSelect(vehicle)}>
      <img src={vehicle.image} alt={vehicle.name} />
      <h3>{vehicle.name}</h3>
      <p>Type: {vehicle.type}</p>
      <p>
        {vehicle.action === 'rent' ? 'Price per day' : 'Price'}: ${vehicle.price}
      </p>
      <p>Condition: {vehicle.condition}</p>
    </div>
  );
};

export default VehicleCard;
