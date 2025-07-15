'use server';

import { revalidatePath } from 'next/cache';
import { addGuestToWaitlist, moveToSeated, removeFromWaitlist } from '../lib/mongodb';

export async function addGuest(formData) {
  try {
    const name = formData.get('name');
    const partySize = parseInt(formData.get('partySize'));
    if (!name || typeof name !== 'string' || !partySize || partySize < 1) {
      throw new Error('Invalid name or party size');
    }
    const guest = await addGuestToWaitlist({ name, partySize, timeAdded: new Date() });
    revalidatePath('/waitlist');
    return { success: true, guest };
  } catch (error) {
    console.error('Error adding guest:', error);
    return { success: false, error: error.message };
  }
}

export async function seatGuest(formData) {
  try {
    const id = formData.get('id');
    const guest = await moveToSeated(id);
    revalidatePath('/waitlist');
    revalidatePath('/seated');
    return { success: true, guest };
  } catch (error) {
    console.error('Error seating guest:', error);
    return { success: false, error: error.message };
  }
}

export async function removeGuest(formData) {
  try {
    const id = formData.get('id');
    await removeFromWaitlist(id);
    revalidatePath('/waitlist');
    return { success: true };
  } catch (error) {
    console.error('Error removing guest:', error);
    return { success: false, error: error.message };
  }
}