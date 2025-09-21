// Authentication service for Firebase Auth
import { 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebaseConfig';

class AuthService {
  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile
        await this.createUserProfile(user, { provider: 'google' });
        return { user, isNewUser: true };
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastActive: serverTimestamp()
        });
        return { user, isNewUser: false };
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  // Sign in with email/password
  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastActive: serverTimestamp()
      });
      
      return result.user;
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  }

  // Sign up with email/password
  async signUpWithEmail(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update display name
      await updateProfile(user, { displayName });
      
      // Create user profile
      await this.createUserProfile(user, { provider: 'email' });
      
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Create user profile in Firestore
  async createUserProfile(user, additionalData = {}) {
    try {
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        profile: {
          name: user.displayName || '',
          email: user.email,
          education: '',
          experience: '',
          skills: [],
          interests: [],
          careerGoals: '',
          learningStyle: '',
          preferredDomains: [],
          location: 'India' // Default
        },
        settings: {
          notifications: true,
          emailUpdates: false,
          theme: 'dark'
        },
        onboardingComplete: false,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        ...additionalData
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Initialize progress document
      await this.initializeUserProgress(user.uid);
      
      return userProfile;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  }

  // Initialize user progress tracking
  async initializeUserProgress(userId) {
    try {
      const progressDoc = {
        userId: userId,
        roadmapId: null,
        currentChapter: 0,
        completedChapters: [],
        quizScores: {},
        totalXP: 0,
        level: 1,
        streak: 0,
        longestStreak: 0,
        lastActivityDate: serverTimestamp(),
        badges: [],
        achievements: [],
        totalTimeSpent: 0, // in minutes
        chaptersStarted: [],
        resourcesViewed: [],
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'progress', userId), progressDoc);
      return progressDoc;
    } catch (error) {
      console.error('Initialize progress error:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        lastUpdated: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      localStorage.removeItem('questionnaireData');
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Password reset
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Auth state observer
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }

  // Save questionnaire data to profile
  async saveQuestionnaireData(userId, questionnaireData) {
    try {
      const updates = {
        'profile.education': questionnaireData.education || '',
        'profile.experience': questionnaireData.experience || '',
        'profile.skills': questionnaireData.currentSkills || [],
        'profile.interests': questionnaireData.interests || [],
        'profile.careerGoals': questionnaireData.careerGoals || '',
        'profile.learningStyle': questionnaireData.learningStyle || '',
        'profile.preferredDomains': questionnaireData.preferredDomains || [],
        'profile.location': questionnaireData.location || 'India',
        onboardingComplete: true,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(doc(db, 'users', userId), updates);
      
      // Also save raw questionnaire data for reference
      await setDoc(doc(db, 'questionnaires', userId), {
        ...questionnaireData,
        userId: userId,
        completedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Save questionnaire error:', error);
      throw error;
    }
  }
}

export default new AuthService();
