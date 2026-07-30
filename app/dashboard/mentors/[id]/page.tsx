"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMentorDetail, useBookings } from "@/hooks/useMentors";
import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ArrowLeft, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function MentorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const mentorId = params.id as string;

  const { mentor, loading: mentorLoading, error: mentorError } = useMentorDetail(mentorId);
  const { createBooking, loading: bookingLoading } = useBookings(user?.uid);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookSession = async () => {
    if (!bookingDate || !bookingTime) {
      setBookingError("Please select a date and time");
      return;
    }

    if (!user || !mentor) {
      setBookingError("User or mentor not found");
      return;
    }

    try {
      setBookingError(null);
      await createBooking(mentor.id, mentor.name, bookingDate, bookingTime, 60);
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingForm(false);
        setBookingSuccess(false);
        setBookingDate("");
        setBookingTime("");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to book session";
      setBookingError(message);
    }
  };

  if (mentorLoading) {
    return (
      <>
        <TopBar title="Mentor Details" />
        <Card>Loading mentor details...</Card>
      </>
    );
  }

  if (mentorError || !mentor) {
    return (
      <>
        <TopBar title="Mentor Details" />
        <Card className="flex items-center gap-3">
          <AlertCircle className="text-danger" size={20} />
          <p className="text-danger">{mentorError || "Mentor not found"}</p>
        </Card>
      </>
    );
  }

  return (
    <>
      <TopBar title="Mentor Details" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft size={16} />
        Back to mentors
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Mentor Info Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <img
              src={mentor.avatarUrl}
              alt={mentor.name}
              className="h-24 w-24 rounded-full mx-auto object-cover mb-4"
            />
            <h2 className="text-2xl font-display font-semibold text-ink">{mentor.name}</h2>
            <p className="text-sm text-muted mt-1">{mentor.branch} · {mentor.year}</p>
            {mentor.company && (
              <p className="text-sm text-primary-700 font-medium mt-3">{mentor.company}</p>
            )}

            <div className="mt-6 space-y-2">
              <Button
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="w-full"
              >
                <Calendar size={16} />
                {showBookingForm ? "Close Booking" : "Book a Session"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-ink mb-4">About</h3>
          <div className="space-y-6">
            {mentor.company && (
              <div>
                <p className="text-sm">
                  <span className="font-medium text-ink">Company:</span>
                  <span className="text-muted ml-2">{mentor.company}</span>
                </p>
              </div>
            )}

            {mentor.skills && mentor.skills.length > 0 && (
              <div>
                <h4 className="font-medium text-ink text-sm mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill) => (
                    <Badge key={skill} tone="neutral">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm">
                <span className="font-medium text-ink">Compatibility:</span>
                <span className="text-primary-600 ml-2 font-semibold">{mentor.compatibility}%</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <Card className="mt-5">
          <h3 className="font-display font-semibold text-ink mb-4">Book a Session</h3>

          {bookingSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">Session booked successfully!</p>
            </div>
          )}

          {bookingError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{bookingError}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                <Calendar size={16} className="inline mr-2" />
                Select Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
                disabled={bookingLoading}
              />
            </div>

            {/* Time Input */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                <Clock size={16} className="inline mr-2" />
                Select Time
              </label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
                disabled={bookingLoading}
              >
                <option value="">Choose a time slot...</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>

            {/* Duration (Fixed at 60 minutes) */}
            <div>
              <p className="text-sm font-medium text-ink mb-2">Duration</p>
              <p className="text-sm text-muted">60 minutes</p>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleBookSession}
              disabled={bookingLoading || !bookingDate || !bookingTime}
              className="w-full"
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
