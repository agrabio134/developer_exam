// components/GuestForm.js
'use client';

import { useState } from 'react';
import { addGuest } from '../actions';

export default function GuestForm({ onAddGuest }) {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const guest = { name, partySize: parseInt(partySize), timeAdded: new Date(), _id: Date.now().toString() };
    if (onAddGuest) {
      onAddGuest(guest);
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('partySize', partySize);

    try {
      const result = await addGuest(formData);
      if (result.success) {
        alert(`Guest "${name}" added successfully`);
        setName('');
        setPartySize(1);
      } else {
        alert(`Error adding guest "${name}": ${result.error}`);
        if (onAddGuest) {
          onAddGuest(null);
        }
      }
    } catch (error) {
      console.error('Error adding guest:', error);
      alert(`Error adding guest "${name}": Network error`);
      if (onAddGuest) {
        onAddGuest(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="guest-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Guest Name"
        className="input"
        required
      />
      <input
        type="number"
        value={partySize}
        onChange={(e) => setPartySize(e.target.value)}
        min="1"
        className="input"
        required
      />
      <button type="submit" className="button" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Guest'}
      </button>
    </form>
  );
}