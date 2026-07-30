import { NextRequest, NextResponse } from "next/server";
import {
  generatePersonalizedRoadmap,
  saveRoadmap,
  getUserRoadmap,
} from "@/lib/roadmap-service";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * GET /api/roadmap?userId=...
 * Fetch user's roadmap from Firestore
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const roadmap = await getUserRoadmap(userId);

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap not found for user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error("[API] GET /roadmap error:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/roadmap
 * Generate personalized roadmap and save to Firestore
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Fetch user profile from Firestore
    const profileRef = doc(db, "profiles", userId);
    const profileSnapshot = await getDoc(profileRef);

    if (!profileSnapshot.exists()) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const profileData = profileSnapshot.data();
    const userProfile = {
      goal: profileData.goal || "Not sure yet",
      branch: profileData.branch || "Other",
      skills: profileData.skills || [],
      interests: profileData.interests || [],
      learningStyle: profileData.learningStyle || "mixed",
      dailyStudyHours: profileData.dailyStudyHours || 2,
      monthlyBudget: profileData.monthlyBudget || 10000,
    };

    console.log("[API] User profile loaded:", {
      userId,
      goal: userProfile.goal,
      branch: userProfile.branch,
      skills: userProfile.skills,
      interests: userProfile.interests,
      learningStyle: userProfile.learningStyle,
      dailyStudyHours: userProfile.dailyStudyHours,
    });

    // Generate personalized roadmap
    const roadmap = await generatePersonalizedRoadmap(userId, userProfile);

    // Save to Firestore
    await saveRoadmap(userId, roadmap, userProfile);

    console.log(`[API] Roadmap generated for userId: ${userId}`);

    return NextResponse.json({
      message: "Roadmap generated and saved",
      roadmap,
    });
  } catch (error) {
    console.error("[API] POST /roadmap error:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
