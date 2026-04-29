/**
 * @file index.js
 * @description Google Cloud Functions for VoteMate AI.
 * Provides secure, server-side data processing for community insights,
 * offloading heavy Firestore queries from the client to Google Cloud.
 *
 * Google Services used:
 * - Google Cloud Functions v2 (serverless compute)
 * - Google Firebase Admin SDK (Firestore access)
 * - Google Cloud Firestore (NoSQL database)
 *
 * Deployed via: firebase deploy --only functions
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");

initializeApp();
const db = getFirestore();

/** Maximum number of documents to query per request */
const MAX_QUERY_LIMIT = 100;

/** Minimum length for state name validation */
const MIN_STATE_LENGTH = 2;

/** Maximum length for state name validation */
const MAX_STATE_LENGTH = 50;

/**
 * Google Cloud Function: getRegionalInsights
 *
 * Securely aggregates anonymized community readiness data
 * for a given Indian state. Returns average readiness scores
 * and trending election topics.
 *
 * @param {Object} request.data - Function input
 * @param {string} request.data.state - Indian state name (e.g., "Maharashtra")
 * @returns {Object} Aggregated regional insights
 * @returns {number} return.averageReadiness - Average readiness score (0-100)
 * @returns {number} return.totalUsers - Number of data points
 * @returns {string[]} return.trendingTopics - Top 5 trending election topics
 *
 * @throws {HttpsError} "invalid-argument" if state is missing or invalid
 * @throws {HttpsError} "internal" if Firestore query fails
 */
exports.getRegionalInsights = onCall(async (request) => {
  try {
    const { state } = request.data;

    // Input validation
    if (!state || typeof state !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with a valid 'state' string."
      );
    }

    // Sanitize state input
    const sanitizedState = state.trim();
    if (
      sanitizedState.length < MIN_STATE_LENGTH ||
      sanitizedState.length > MAX_STATE_LENGTH
    ) {
      throw new HttpsError(
        "invalid-argument",
        `State name must be between ${MIN_STATE_LENGTH} and ${MAX_STATE_LENGTH} characters.`
      );
    }

    const snapshot = await db
      .collection("community_insights")
      .where("state", "==", sanitizedState)
      .orderBy("timestamp", "desc")
      .limit(MAX_QUERY_LIMIT)
      .get();

    let totalReadiness = 0;
    const topics = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalReadiness += data.readinessScore || 0;

      if (data.topic && typeof data.topic === "string") {
        topics[data.topic] = (topics[data.topic] || 0) + 1;
      }
    });

    const averageReadiness = snapshot.empty
      ? 0
      : Math.round(totalReadiness / snapshot.size);

    return {
      averageReadiness,
      totalUsers: snapshot.size,
      trendingTopics: Object.entries(topics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic]) => topic),
    };
  } catch (error) {
    // Re-throw HttpsError instances (client-safe errors)
    if (error instanceof HttpsError) {
      throw error;
    }
    // Wrap unexpected errors
    console.error("[VoteMate Cloud Function] Error:", error);
    throw new HttpsError("internal", "Failed to fetch regional insights.");
  }
});
