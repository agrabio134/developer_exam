// components/GuestForm.js
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { addGuest } from '../waitlist/actions';

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
        toast.success(`Guest "${name}" added successfully`);
        setName('');
        setPartySize(1);
      } else {
        toast.error(`Error adding guest "${name}": ${result.error}`);
        if (onAddGuest) {
          onAddGuest(null);
        }
      }
    } catch (error) {
      console.error('Error adding guest:', error);
      toast.error(`Error adding guest "${name}": Network error`);
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
      <button type="submit" className="button btn-add" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Guest'}
      </button>
    </form>
  );
}