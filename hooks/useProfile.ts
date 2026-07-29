"use client";

import { useCallback } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useProfile() {
  const saveProfile = useCallback(
    async (userId: string, profileData: {
      monthlyBudget: number;
      dailyStudyHours: number;
      branch: string;
      skills: string[];
      interests: string[];
      goal: string;
      learningStyle: string;
    }) => {
      try {
        await setDoc(doc(db, "profiles", userId), {
          userId,
          ...profileData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return true;
      } catch (error) {
        console.error("Failed to save profile:", error);
        return false;
      }
    },
    []
  );

  return { saveProfile };
}
