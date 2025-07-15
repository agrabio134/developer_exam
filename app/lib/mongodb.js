import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient && cachedClient.connection.readyState === 1) {
    return cachedClient;
  }
  try {
    cachedClient = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    return cachedClient;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

const waitlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  timeAdded: { type: Date, default: Date.now },
});

const seatedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  timeAdded: { type: Date, required: true },
  timeSeated: { type: Date, default: Date.now },
});

const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);
const Seated = mongoose.models.Seated || mongoose.model('Seated', seatedSchema);

export async function addGuestToWaitlist(guest) {
  await connectToDatabase();
  try {
    const newGuest = new Waitlist(guest);
    await newGuest.save();
    return newGuest;
  } catch (error) {
    console.error('Error adding guest:', error);
    throw new Error('Failed to add guest');
  }
}

export async function getWaitlist() {
  await connectToDatabase();
  try {
    return await Waitlist.find({}).sort({ timeAdded: -1 }).lean();
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    throw new Error('Failed to fetch waitlist');
  }
}

export async function moveToSeated(id) {
  await connectToDatabase();
  try {
    const guest = await Waitlist.findById(id);
    if (!guest) throw new Error('Guest not found');
    const seatedGuest = new Seated({
      name: guest.name,
      partySize: guest.partySize,
      timeAdded: guest.timeAdded,
      timeSeated: new Date(),
    });
    await seatedGuest.save();
    await Waitlist.deleteOne({ _id: id });
    return seatedGuest;
  } catch (error) {
    console.error('Error seating guest:', error);
    throw new Error('Failed to seat guest');
  }
}

export async function removeFromWaitlist(id) {
  await connectToDatabase();
  try {
    const result = await Waitlist.deleteOne({ _id: id });
    if (result.deletedCount === 0) throw new Error('Guest not found');
  } catch (error) {
    console.error('Error removing guest:', error);
    throw new Error('Failed to remove guest');
  }
}

export async function getSeated() {
  await connectToDatabase();
  try {
    return await Seated.find({}).sort({ timeSeated: 1 }).lean();
  } catch (error) {
    console.error('Error fetching seated log:', error);
    throw new Error('Failed to fetch seated log');
  }
}