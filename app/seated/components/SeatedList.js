// components/SeatedList.js
import { getSeated } from '../../lib/mongodb';

export default async function SeatedList() {
  let seatedGuests = [];
  try {
    seatedGuests = await getSeated();
  } catch (error) {
    return <div className="error">Error loading seated log: {error.message}</div>;
  }

  return (
    <div>
      {seatedGuests.length === 0 ? (
        <p className="empty-state">No seated guests yet</p>
      ) : (
        <table className="guest-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Party</th>
              <th>Time Seated</th>
            </tr>
          </thead>
          <tbody>
            {seatedGuests.map((guest) => (
              <tr key={guest._id}>
                <td>{guest.name}</td>
                <td>{guest.partySize}</td>
                <td>{new Date(guest.timeSeated).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}