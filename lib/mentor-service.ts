import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Mentor } from "@/types";

export interface BookingSlot {
  date: string;
  time: string;
  duration: number; // in minutes
  available: boolean;
}

export interface Booking {
  id: string;
  studentId: string;
  mentorId: string;
  mentorName: string;
  date: string;
  time: string;
  duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Get all mentors
 */
export async function getAllMentors(): Promise<Mentor[]> {
  try {
    const mentorsCollection = collection(db, "mentors");
    const snapshot = await getDocs(mentorsCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Mentor));
  } catch (error) {
    console.error("[Mentor Service] Error fetching mentors:", error);
    throw error;
  }
}

/**
 * Get mentor by ID
 */
export async function getMentorById(mentorId: string): Promise<Mentor | null> {
  try {
    const mentorRef = doc(db, "mentors", mentorId);
    const snapshot = await getDoc(mentorRef);
    if (!snapshot.exists()) {
      return null;
    }
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Mentor;
  } catch (error) {
    console.error("[Mentor Service] Error fetching mentor:", error);
    throw error;
  }
}

/**
 * Create a booking
 */
export async function createBooking(
  studentId: string,
  mentorId: string,
  mentorName: string,
  date: string,
  time: string,
  duration: number
): Promise<string> {
  try {
    const bookingsCollection = collection(db, "bookings");
    const bookingRef = doc(bookingsCollection);

    const booking: Omit<Booking, "id"> = {
      studentId,
      mentorId,
      mentorName,
      date,
      time,
      duration,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(bookingRef, booking);
    console.log("[Mentor Service] Booking created:", bookingRef.id);
    return bookingRef.id;
  } catch (error) {
    console.error("[Mentor Service] Error creating booking:", error);
    throw error;
  }
}

/**
 * Get student's bookings
 */
export async function getStudentBookings(studentId: string): Promise<Booking[]> {
  try {
    const bookingsCollection = collection(db, "bookings");
    const q = query(bookingsCollection, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Booking));
  } catch (error) {
    console.error("[Mentor Service] Error fetching bookings:", error);
    throw error;
  }
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status: "cancelled",
      updatedAt: Timestamp.now(),
    });
    console.log("[Mentor Service] Booking cancelled:", bookingId);
  } catch (error) {
    console.error("[Mentor Service] Error cancelling booking:", error);
    throw error;
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
): Promise<void> {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: Timestamp.now(),
    });
    console.log("[Mentor Service] Booking status updated:", bookingId, status);
  } catch (error) {
    console.error("[Mentor Service] Error updating booking:", error);
    throw error;
  }
}
