// Firebase Admin SDK initialization for backend
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
function initializeFirebase() {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('✅ Firebase Admin already initialized');
      return admin;
    }

    // Initialize with service account
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (serviceAccountPath && require('fs').existsSync(serviceAccountPath)) {
      const serviceAccount = require(path.resolve(serviceAccountPath));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      
      console.log('✅ Firebase Admin initialized with service account');
    } else {
      // Initialize with default credentials (for cloud deployment)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      
      console.log('✅ Firebase Admin initialized with default credentials');
    }

    return admin;
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    return null;
  }
}

// Initialize on module load
const firebaseAdmin = initializeFirebase();

// Firestore reference
const db = firebaseAdmin ? firebaseAdmin.firestore() : null;

// Service class for Firebase operations
class FirebaseService {
  constructor() {
    this.admin = firebaseAdmin;
    this.db = db;
  }

  // User Management
  async createUser(userData) {
    try {
      const userRecord = await this.admin.auth().createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: false
      });

      // Create Firestore profile
      await this.createUserProfile(userRecord.uid, userData);
      
      return { success: true, uid: userRecord.uid };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, error: error.message };
    }
  }

  async createUserProfile(uid, userData) {
    try {
      const profile = {
        uid: uid,
        email: userData.email,
        displayName: userData.displayName || '',
        profile: {
          name: userData.displayName || '',
          email: userData.email,
          education: userData.education || '',
          experience: userData.experience || '',
          skills: userData.skills || [],
          interests: userData.interests || [],
          careerGoals: userData.careerGoals || '',
          learningStyle: userData.learningStyle || '',
          preferredDomains: userData.preferredDomains || [],
          location: userData.location || 'India'
        },
        settings: {
          notifications: true,
          emailUpdates: false,
          theme: 'dark'
        },
        onboardingComplete: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastActive: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('users').doc(uid).set(profile);
      await this.initializeUserProgress(uid);
      
      return profile;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  }

  async initializeUserProgress(uid) {
    try {
      const progress = {
        userId: uid,
        roadmapId: null,
        currentChapter: 0,
        completedChapters: [],
        quizScores: {},
        totalXP: 0,
        level: 1,
        streak: 0,
        longestStreak: 0,
        lastActivityDate: admin.firestore.FieldValue.serverTimestamp(),
        badges: [],
        achievements: [],
        totalTimeSpent: 0,
        chaptersStarted: [],
        resourcesViewed: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('progress').doc(uid).set(progress);
      return progress;
    } catch (error) {
      console.error('Initialize progress error:', error);
      throw error;
    }
  }

  async getUserProfile(uid) {
    try {
      const doc = await this.db.collection('users').doc(uid).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  async updateUserProfile(uid, updates) {
    try {
      await this.db.collection('users').doc(uid).update({
        ...updates,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Progress Tracking
  async updateProgress(uid, progressData) {
    try {
      const updates = {
        ...progressData,
        lastActivityDate: admin.firestore.FieldValue.serverTimestamp()
      };

      // Update streak
      const progress = await this.getProgress(uid);
      const lastActivity = progress?.lastActivityDate?.toDate();
      const today = new Date();
      
      if (lastActivity) {
        const daysSinceLastActivity = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastActivity === 1) {
          updates.streak = (progress.streak || 0) + 1;
          updates.longestStreak = Math.max(updates.streak, progress.longestStreak || 0);
        } else if (daysSinceLastActivity > 1) {
          updates.streak = 1;
        }
      } else {
        updates.streak = 1;
        updates.longestStreak = 1;
      }

      // Calculate XP
      if (progressData.completedChapter) {
        updates.totalXP = admin.firestore.FieldValue.increment(100);
      }
      if (progressData.quizScore) {
        updates.totalXP = admin.firestore.FieldValue.increment(progressData.quizScore);
      }

      // Update level
      const newXP = (progress?.totalXP || 0) + (updates.totalXP || 0);
      updates.level = Math.floor(newXP / 500) + 1;

      // Check for badges
      updates.badges = await this.checkBadges(uid, updates, progress);

      await this.db.collection('progress').doc(uid).update(updates);
      
      return { success: true, updates };
    } catch (error) {
      console.error('Update progress error:', error);
      return { success: false, error: error.message };
    }
  }

  async getProgress(uid) {
    try {
      const doc = await this.db.collection('progress').doc(uid).get();
      
      if (!doc.exists) {
        await this.initializeUserProgress(uid);
        return await this.getProgress(uid);
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Get progress error:', error);
      return null;
    }
  }

  async checkBadges(uid, updates, currentProgress) {
    const badges = [...(currentProgress?.badges || [])];
    
    // First Quiz Badge
    if (updates.quizScore && !badges.includes('first_quiz')) {
      badges.push('first_quiz');
    }
    
    // Streak Badges
    if (updates.streak >= 7 && !badges.includes('week_warrior')) {
      badges.push('week_warrior');
    }
    if (updates.streak >= 30 && !badges.includes('month_master')) {
      badges.push('month_master');
    }
    
    // Chapter Completion Badges
    if (updates.completedChapters?.length >= 1 && !badges.includes('chapter_complete')) {
      badges.push('chapter_complete');
    }
    if (updates.completedChapters?.length >= 5 && !badges.includes('halfway_there')) {
      badges.push('halfway_there');
    }
    
    // XP Badges
    const totalXP = (currentProgress?.totalXP || 0) + (updates.totalXP || 0);
    if (totalXP >= 1000 && !badges.includes('xp_1000')) {
      badges.push('xp_1000');
    }
    if (totalXP >= 5000 && !badges.includes('xp_5000')) {
      badges.push('xp_5000');
    }
    
    return badges;
  }

  // Analytics Caching
  async cacheAnalytics(uid, skill, location, analyticsData) {
    try {
      const cacheDoc = {
        userId: uid,
        skill: skill,
        location: location,
        data: analyticsData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };

      const cacheId = `${uid}_${skill}_${location}`.replace(/\s+/g, '_').toLowerCase();
      await this.db.collection('analytics_cache').doc(cacheId).set(cacheDoc);
      
      return { success: true, cacheId };
    } catch (error) {
      console.error('Cache analytics error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCachedAnalytics(uid, skill, location) {
    try {
      const cacheId = `${uid}_${skill}_${location}`.replace(/\s+/g, '_').toLowerCase();
      const doc = await this.db.collection('analytics_cache').doc(cacheId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      const data = doc.data();
      const expiresAt = data.expiresAt?.toDate();
      
      // Check if cache is expired
      if (expiresAt && expiresAt < new Date()) {
        return null;
      }
      
      return data.data;
    } catch (error) {
      console.error('Get cached analytics error:', error);
      return null;
    }
  }

  // Quiz Management
  async saveQuiz(quiz) {
    try {
      const quizDoc = {
        ...quiz,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const result = await this.db.collection('quizzes').add(quizDoc);
      
      return { success: true, quizId: result.id };
    } catch (error) {
      console.error('Save quiz error:', error);
      return { success: false, error: error.message };
    }
  }

  async getQuiz(quizId) {
    try {
      const doc = await this.db.collection('quizzes').doc(quizId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Get quiz error:', error);
      return null;
    }
  }

  async saveQuizResult(uid, quizId, score, answers) {
    try {
      const resultDoc = {
        userId: uid,
        quizId: quizId,
        score: score,
        answers: answers,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('quiz_results').add(resultDoc);
      
      // Update user progress
      await this.db.collection('progress').doc(uid).update({
        [`quizScores.${quizId}`]: score,
        totalXP: admin.firestore.FieldValue.increment(Math.floor(score / 10))
      });
      
      return { success: true };
    } catch (error) {
      console.error('Save quiz result error:', error);
      return { success: false, error: error.message };
    }
  }

  // Roadmap Management
  async saveRoadmap(uid, roadmap) {
    try {
      const roadmapDoc = {
        ...roadmap,
        userId: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const result = await this.db.collection('roadmaps').add(roadmapDoc);
      
      // Update user progress with roadmap ID
      await this.db.collection('progress').doc(uid).update({
        roadmapId: result.id,
        currentChapter: 1,
        chaptersStarted: [1]
      });
      
      return { success: true, roadmapId: result.id };
    } catch (error) {
      console.error('Save roadmap error:', error);
      return { success: false, error: error.message };
    }
  }

  async getRoadmap(roadmapId) {
    try {
      const doc = await this.db.collection('roadmaps').doc(roadmapId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Get roadmap error:', error);
      return null;
    }
  }

  // Weekly/Monthly Reports
  async generateWeeklyReport(uid) {
    try {
      const progress = await this.getProgress(uid);
      const profile = await this.getUserProfile(uid);
      
      const report = {
        userId: uid,
        week: new Date().toISOString().slice(0, 10),
        chaptersCompleted: progress.completedChapters?.length || 0,
        quizzesCompleted: Object.keys(progress.quizScores || {}).length,
        averageScore: this.calculateAverageScore(progress.quizScores),
        timeSpent: progress.totalTimeSpent || 0,
        xpEarned: progress.totalXP || 0,
        streak: progress.streak || 0,
        achievements: progress.badges || [],
        recommendations: await this.generateRecommendations(progress, profile)
      };

      await this.db.collection('weekly_reports').add({
        ...report,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return report;
    } catch (error) {
      console.error('Generate weekly report error:', error);
      return null;
    }
  }

  calculateAverageScore(scores) {
    if (!scores || Object.keys(scores).length === 0) return 0;
    
    const values = Object.values(scores);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }

  async generateRecommendations(progress, profile) {
    // Generate personalized recommendations based on progress
    const recommendations = [];
    
    if (progress.streak < 3) {
      recommendations.push('Try to maintain a daily learning streak for better retention');
    }
    
    if (this.calculateAverageScore(progress.quizScores) < 70) {
      recommendations.push('Review previous chapters before moving forward');
    }
    
    if (!progress.badges?.includes('first_project')) {
      recommendations.push('Start working on your first project to apply what you learned');
    }
    
    return recommendations;
  }

  // Verify Firebase connection
  async verifyConnection() {
    try {
      if (!this.admin || !this.db) {
        return { connected: false, error: 'Firebase not initialized' };
      }
      
      // Try a simple read operation
      const testDoc = await this.db.collection('_test').doc('connection').get();
      
      return { connected: true, message: 'Firebase connected successfully' };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

module.exports = new FirebaseService();
