// components/GuestList.js
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { seatGuest, removeGuest } from '../waitlist/actions';

export default function GuestList({ initialGuests }) {
  const [guests, setGuests] = useState(initialGuests || []);
  const [error, setError] = useState(null);

  // Fetch guests on mount and when triggered
  useEffect(() => {
    async function fetchGuests() {
      try {
        const response = await fetch('/api/waitlist', {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch waitlist');
        }
        const data = await response.json();
        setGuests(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchGuests();
  }, [initialGuests]);

  // Handle seat action
  const handleSeat = async (id, name) => {
    const previousGuests = guests;
    setGuests(guests.filter((g) => g._id !== id));
    const formData = new FormData();
    formData.append('id', id);
    try {
      const result = await seatGuest(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success(`Guest "${name}" seated successfully`);
    } catch (error) {
      console.error('Error seating guest:', error);
      setGuests(previousGuests);
      toast.error(`Error seating guest "${name}": ${error.message}`);
    }
  };

  // Handle remove action
  const handleRemove = async (id, name) => {
    const previousGuests = guests;
    setGuests(guests.filter((g) => g._id !== id));
    const formData = new FormData();
    formData.append('id', id);
    try {
      const result = await removeGuest(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success(`Guest "${name}" removed successfully`);
    } catch (error) {
      console.error('Error removing guest:', error);
      setGuests(previousGuests);
      toast.error(`Error removing guest "${name}": ${error.message}`);
    }
  };

  if (error) {
    return <div className="error">Error loading waitlist: {error}</div>;
  }

  return (
    <div>
      {guests.length === 0 ? (
        <p className="empty-state">No guests yet</p>
      ) : (
        <table className="guest-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Party</th>
              <th>Time Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest._id}>
                <td>{guest.name}</td>
                <td>{guest.partySize}</td>
                <td>{new Date(guest.timeAdded).toLocaleTimeString()}</td>
                <td>
                  <form action={seatGuest}>
                    <input type="hidden" name="id" value={guest._id} />
                    <button
                      type="submit"
                      className="button button-green"
                      onClick={() => handleSeat(guest._id, guest.name)}
                    >
                      Seat
                    </button>
                  </form>
                  <form action={removeGuest}>
                    <input type="hidden" name="id" value={guest._id} />
                    <button
                      type="submit"
                      className="button button-red"
                      onClick={() => handleRemove(guest._id, guest.name)}
                    >
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}