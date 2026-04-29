const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");

initializeApp();
const db = getFirestore();

/**
 * Cloud Function to securely handle community insights
 * This offloads heavy DB queries from the client to the cloud.
 */
exports.getRegionalInsights = onCall(async (request) => {
  try {
    const { state } = request.data;
    if (!state) {
      throw new HttpsError("invalid-argument", "The function must be called with a valid 'state'.");
    }

    const snapshot = await db.collection("community_insights")
      .where("state", "==", state)
      .orderBy("timestamp", "desc")
      .limit(100)
      .get();

    let totalReadiness = 0;
    const topics = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      totalReadiness += data.readinessScore || 0;
      
      if (data.topic) {
        topics[data.topic] = (topics[data.topic] || 0) + 1;
      }
    });

    const averageReadiness = snapshot.empty ? 0 : Math.round(totalReadiness / snapshot.size);

    return {
      averageReadiness,
      totalUsers: snapshot.size,
      trendingTopics: Object.entries(topics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic]) => topic)
    };
  } catch (error) {
    throw new HttpsError("internal", "Failed to fetch regional insights");
  }
});
