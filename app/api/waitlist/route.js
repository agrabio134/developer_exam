import { NextResponse } from 'next/server';
import { getWaitlist } from '../../lib/mongodb';

export async function GET() {
  try {
    const guests = await getWaitlist();
    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}