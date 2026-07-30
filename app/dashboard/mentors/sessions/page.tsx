"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useMentors";
import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Calendar, Clock, AlertCircle, CheckCircle2, X } from "lucide-react";

export default function SessionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { bookings, loading, error, cancelBooking } = useBookings(user?.uid);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string, mentorName: string) => {
    if (!confirm(`Cancel session with ${mentorName}?`)) return;

    try {
      setCancelError(null);
      await cancelBooking(bookingId);
      setCancelSuccess(`Session with ${mentorName} cancelled`);
      setTimeout(() => setCancelSuccess(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to cancel booking";
      setCancelError(message);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <TopBar title="My Sessions" />
        <Card>Loading your sessions...</Card>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar title="My Sessions" />
        <Card className="flex items-center gap-3">
          <AlertCircle className="text-danger" size={20} />
          <p className="text-danger">{error}</p>
        </Card>
      </>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <>
        <TopBar title="My Sessions" />
        <Card className="text-center py-12">
          <Calendar size={48} className="mx-auto text-muted mb-4" />
          <h3 className="font-display font-semibold text-ink mb-2">No sessions yet</h3>
          <p className="text-muted text-sm">Book a session with a mentor to get started!</p>
        </Card>
      </>
    );
  }

  const upcomingSessions = bookings.filter((b) => b.status !== "cancelled" && b.status !== "completed");
  const completedSessions = bookings.filter((b) => b.status === "completed");
  const cancelledSessions = bookings.filter((b) => b.status === "cancelled");

  return (
    <>
      <TopBar title="My Sessions" />

      {cancelSuccess && (
        <Card className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200">
          <CheckCircle2 size={18} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-800">{cancelSuccess}</p>
        </Card>
      )}

      {cancelError && (
        <Card className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <p className="text-sm text-red-800">{cancelError}</p>
        </Card>
      )}

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-display font-semibold text-ink mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {upcomingSessions.map((booking) => (
              <Card key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-ink">{booking.mentorName}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {booking.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {booking.duration} min
                    </div>
                  </div>
                  <Badge tone={booking.status === "confirmed" ? "success" : "primary"} className="mt-2">
                    {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id, booking.mentorName)}
                  >
                    <X size={14} />
                    Cancel
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-display font-semibold text-ink mb-4">Completed Sessions</h3>
          <div className="space-y-4">
            {completedSessions.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <div>
                  <p className="font-medium text-ink">{booking.mentorName}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {booking.time}
                    </div>
                  </div>
                  <Badge tone="success" className="mt-2">Completed</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Sessions */}
      {cancelledSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-display font-semibold text-ink mb-4">Cancelled Sessions</h3>
          <div className="space-y-4">
            {cancelledSessions.map((booking) => (
              <Card key={booking.id} className="opacity-50">
                <div>
                  <p className="font-medium text-ink line-through">{booking.mentorName}</p>
                  <Badge tone="neutral" className="mt-2">Cancelled</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
