import GuestForm from './components/GuestForm';
import GuestList from './components/GuestList';

import { getWaitlist } from '../lib/mongodb';

export default async function WaitlistPage() {
  let initialGuests = [];
  try {
    initialGuests = await getWaitlist();
  } catch (error) {
    console.error('Error fetching initial waitlist:', error);
    initialGuests = [];
  }

  return (
    <div className="container">
      <h1 className="page-title">Waitlist</h1>
      <GuestForm />
      <GuestList initialGuests={initialGuests} />
    </div>
  );
}