"use client";

import { useState, useEffect } from "react";
import type { Mentor } from "@/types";
import { mentors as mockMentors } from "@/lib/mock-data";

interface Booking {
  id: string;
  studentId: string;
  mentorId: string;
  mentorName: string;
  date: string;
  time: string;
  duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: any;
  updatedAt: any;
}

const API_BASE = "/api";

export function useMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        console.log("[useMentors] Fetching mentors");
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/mentors`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch mentors");
        }

        const { mentors: data } = await res.json();
        console.log("[useMentors] Received mentors:", data);

        // Use Firestore data if available, otherwise use mock data
        if (data && data.length > 0) {
          setMentors(data);
        } else {
          console.log("[useMentors] No mentors in Firestore, using mock data");
          setMentors(mockMentors);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load mentors";
        console.error("[useMentors] Error:", message);
        console.log("[useMentors] Falling back to mock data");
        setMentors(mockMentors);
        setError(null); // Don't show error if we have fallback
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  return { mentors, loading, error };
}

export function useMentorDetail(mentorId: string) {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId) {
      setLoading(false);
      return;
    }

    const fetchMentor = async () => {
      try {
        console.log("[useMentorDetail] Fetching mentor:", mentorId);
        setLoading(true);
        setError(null);

        // Try Firestore first
        const res = await fetch(`${API_BASE}/mentors/${mentorId}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const { mentor: data } = await res.json();
          console.log("[useMentorDetail] Received mentor from Firestore:", data);
          setMentor(data);
          return;
        }

        // Fall back to mock data if not found in Firestore
        console.log("[useMentorDetail] Mentor not in Firestore, checking mock data");
        const mockMentor = mockMentors.find((m) => m.id === mentorId);
        if (mockMentor) {
          console.log("[useMentorDetail] Found mentor in mock data:", mockMentor);
          setMentor(mockMentor as Mentor);
          setError(null);
        } else {
          throw new Error("Mentor not found");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load mentor";
        console.error("[useMentorDetail] Error:", message);
        setError(message);
        setMentor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  return { mentor, loading, error };
}

export function useBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log("[useBookings] Fetching bookings for userId:", userId);
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/bookings?userId=${userId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const { bookings: data } = await res.json();
        console.log("[useBookings] Received bookings:", data);
        setBookings(data || []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load bookings";
        console.error("[useBookings] Error:", message);
        setError(message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const createBooking = async (
    mentorId: string,
    mentorName: string,
    date: string,
    time: string,
    duration: number
  ) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      console.log("[useBookings] Creating booking");
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          mentorId,
          mentorName,
          date,
          time,
          duration,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create booking");
      }

      const { bookingId } = await res.json();
      console.log("[useBookings] Booking created:", bookingId);

      // Refresh bookings
      const bookingsRes = await fetch(`${API_BASE}/bookings?userId=${userId}`);
      const { bookings: updatedBookings } = await bookingsRes.json();
      setBookings(updatedBookings);

      return bookingId;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create booking";
      console.error("[useBookings] Error:", message);
      throw err;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      console.log("[useBookings] Cancelling booking:", bookingId);
      const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel booking");
      }

      console.log("[useBookings] Booking cancelled");

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel booking";
      console.error("[useBookings] Error:", message);
      throw err;
    }
  };

  return { bookings, loading, error, createBooking, cancelBooking };
}
