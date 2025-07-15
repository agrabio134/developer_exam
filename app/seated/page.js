import SeatedList from './components/SeatedList';

export default async function SeatedPage() {
  return (
    <div className="container">
      <h1 className="page-title">Seated Guests</h1>
      <SeatedList />
    </div>
  );
}