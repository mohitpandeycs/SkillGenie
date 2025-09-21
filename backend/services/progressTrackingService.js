const firebaseService = require('./firebaseAdmin');
// const geminiService = require('./improvedGeminiService'); // Disabled due to syntax errors

class ProgressTrackingService {
  constructor() {
    // In-memory storage for demo (should use database in production)
    this.userProgress = {};
    // Activity logs for streak and progress tracking
    this.activityLogs = {};
    // Points logs for total points calculation
    this.pointsLogs = {};
    // Skills data for mastery calculation
    this.skillsData = {};
    console.log('📊 Enhanced Progress Tracking Service initialized');
  }

  /**
   * Get user's overall progress
   * @param {string} userId - User ID
   * @returns {Object} Overall progress data
   */
  getUserProgress(userId) {
    if (!this.userProgress[userId]) {
      this.initializeUserProgress(userId);
    }
    
    const progress = this.userProgress[userId];
    
    return {
      success: true,
      data: {
        userId: userId,
        totalChapters: progress.totalChapters,
        completedChapters: progress.completedChapters,
        currentChapter: progress.currentChapter,
        overallProgress: Math.round((progress.completedChapters / progress.totalChapters) * 100),
        skillProgress: progress.skillProgress,
        lastActivity: progress.lastActivity,
        totalPoints: progress.totalPoints,
        level: this.calculateLevel(progress.totalPoints),
        streak: progress.streak,
        achievements: progress.achievements
      }
    };
  }

  /**
   * Update chapter progress
   * @param {string} userId - User ID
   * @param {number} chapterId - Chapter ID
   * @param {Object} progressData - Progress data
   * @returns {Object} Updated progress
   */
  updateChapterProgress(userId, chapterId, progressData) {
    if (!this.userProgress[userId]) {
      this.initializeUserProgress(userId);
    }
    
    const userProg = this.userProgress[userId];
    
    // Update chapter-specific progress
    if (!userProg.chapters[chapterId]) {
      userProg.chapters[chapterId] = {
        id: chapterId,
        status: 'not_started',
        progress: 0,
        quizScore: null,
        completedAt: null
      };
    }
    
    const chapter = userProg.chapters[chapterId];
    
    // Update chapter data
    if (progressData.progress !== undefined) {
      chapter.progress = progressData.progress;
    }
    
    if (progressData.quizScore !== undefined) {
      chapter.quizScore = progressData.quizScore;
      // Award points for quiz completion
      if (progressData.quizScore >= 70) {
        userProg.totalPoints += 150;
      }
    }
    
    if (progressData.status !== undefined) {
      chapter.status = progressData.status;
      if (progressData.status === 'completed' && !chapter.completedAt) {
        chapter.completedAt = new Date();
        userProg.completedChapters++;
        userProg.totalPoints += 100; // Bonus for chapter completion
      }
    }
    
    // Update current chapter
    if (chapter.status === 'in_progress') {
      userProg.currentChapter = chapterId;
    }
    
    // Update last activity
    userProg.lastActivity = new Date();
    
    // Check for achievements
    this.checkAchievements(userId);
    
    return {
      success: true,
      data: {
        chapterProgress: chapter,
        overallProgress: Math.round((userProg.completedChapters / userProg.totalChapters) * 100),
        totalPoints: userProg.totalPoints,
        level: this.calculateLevel(userProg.totalPoints)
      }
    };
  }

  /**
   * Get roadmap progress
   * @param {string} userId - User ID
   * @param {string} roadmapId - Roadmap ID
   * @returns {Object} Roadmap progress
   */
  getRoadmapProgress(userId, roadmapId) {
    if (!this.userProgress[userId]) {
      this.initializeUserProgress(userId);
    }
    
    const userProg = this.userProgress[userId];
    
    // Calculate roadmap-specific progress
    const chapters = Object.values(userProg.chapters);
    const roadmapChapters = chapters.filter(c => c.roadmapId === roadmapId || true); // For demo, include all
    
    const completedCount = roadmapChapters.filter(c => c.status === 'completed').length;
    const totalCount = Math.max(roadmapChapters.length, userProg.totalChapters);
    
    return {
      success: true,
      data: {
        roadmapId: roadmapId,
        totalChapters: totalCount,
        completedChapters: completedCount,
        progress: Math.round((completedCount / totalCount) * 100),
        currentChapter: userProg.currentChapter,
        chapters: roadmapChapters,
        estimatedTimeRemaining: (totalCount - completedCount) * 2, // 2 hours per chapter estimate
        lastUpdated: userProg.lastActivity
      }
    };
  }

  /**
   * Update skill progress
   * @param {string} userId - User ID
   * @param {string} skill - Skill name
   * @param {number} progress - Progress value (0-100)
   * @returns {Object} Updated skill progress
   */
  updateSkillProgress(userId, skill, progress) {
    if (!this.userProgress[userId]) {
      this.initializeUserProgress(userId);
    }
    
    const userProg = this.userProgress[userId];
    
    if (!userProg.skillProgress[skill]) {
      userProg.skillProgress[skill] = {
        skill: skill,
        level: 'beginner',
        progress: 0,
        startedAt: new Date()
      };
    }
    
    userProg.skillProgress[skill].progress = progress;
    
    // Update skill level based on progress
    if (progress >= 80) {
      userProg.skillProgress[skill].level = 'advanced';
    } else if (progress >= 40) {
      userProg.skillProgress[skill].level = 'intermediate';
    }
    
    userProg.lastActivity = new Date();
    
    return {
      success: true,
      data: userProg.skillProgress[skill]
    };
  }

  /**
   * Initialize user progress
   * @param {string} userId - User ID
   */
  initializeUserProgress(userId) {
    this.userProgress[userId] = {
      userId: userId,
      totalChapters: 10, // Default total chapters
      completedChapters: 0,
      currentChapter: 0, // Start at 0, not 1
      chapters: {},
      skillProgress: {},
      totalPoints: 0,
      streak: 0,
      achievements: [],
      lastActivity: null, // No activity yet
      createdAt: new Date()
    };
    
    // Initialize empty data structures (no sample data)
    this.initializeEmptyActivityLogs(userId);
    this.initializeEmptyPointsLogs(userId);
    this.initializeEmptySkillsData(userId);
    
    console.log(`\u2705 User progress initialized from scratch for ${userId}`);
  }
  
  /**
   * Reset user progress (for testing or starting over)
   * @param {string} userId - User ID
   */
  resetUserProgress(userId) {
    if (this.userProgress[userId]) {
      delete this.userProgress[userId];
    }
    if (this.activityLogs[userId]) {
      delete this.activityLogs[userId];
    }
    if (this.pointsLogs[userId]) {
      delete this.pointsLogs[userId];
    }
    if (this.skillsData[userId]) {
      delete this.skillsData[userId];
    }
    
    // Reinitialize with clean data
    this.initializeUserProgress(userId);
    
    console.log(`🔄 User progress reset for ${userId}`);
    
    return {
      success: true,
      message: 'User progress has been reset'
    };
  }

  /**
   * Calculate user level based on points
   * @param {number} points - Total points
   * @returns {Object} Level information
   */
  calculateLevel(points) {
    const levels = [
      { level: 1, name: 'Beginner', minPoints: 0 },
      { level: 2, name: 'Learner', minPoints: 500 },
      { level: 3, name: 'Practitioner', minPoints: 1500 },
      { level: 4, name: 'Skilled', minPoints: 3000 },
      { level: 5, name: 'Expert', minPoints: 5000 },
      { level: 6, name: 'Master', minPoints: 10000 }
    ];
    
    let currentLevel = levels[0];
    for (const level of levels) {
      if (points >= level.minPoints) {
        currentLevel = level;
      }
    }
    
    const nextLevel = levels[currentLevel.level] || levels[levels.length - 1];
    const pointsToNext = nextLevel.minPoints - points;
    
    return {
      current: currentLevel.level,
      name: currentLevel.name,
      points: points,
      pointsToNext: Math.max(0, pointsToNext),
      nextLevelName: nextLevel.name
    };
  }

  /**
   * Check and award achievements
   * @param {string} userId - User ID
   */
  checkAchievements(userId) {
    const userProg = this.userProgress[userId];
    
    // First Chapter Achievement
    if (userProg.completedChapters === 1 && !userProg.achievements.find(a => a.id === 'first_chapter')) {
      userProg.achievements.push({
        id: 'first_chapter',
        name: 'First Steps',
        description: 'Complete your first chapter',
        earnedAt: new Date(),
        icon: '🎯'
      });
    }
    
    // Half Way Achievement
    if (userProg.completedChapters >= userProg.totalChapters / 2 && 
        !userProg.achievements.find(a => a.id === 'halfway')) {
      userProg.achievements.push({
        id: 'halfway',
        name: 'Halfway There',
        description: 'Complete 50% of your learning path',
        earnedAt: new Date(),
        icon: '🌟'
      });
    }
    
    // Quiz Master Achievement
    const quizScores = Object.values(userProg.chapters)
      .filter(c => c.quizScore !== null)
      .map(c => c.quizScore);
    
    if (quizScores.length >= 3 && 
        quizScores.every(score => score >= 90) &&
        !userProg.achievements.find(a => a.id === 'quiz_master')) {
      userProg.achievements.push({
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Score 90% or higher on 3 quizzes',
        earnedAt: new Date(),
        icon: '🏆'
      });
    }
  }

  /**
   * Get comprehensive dashboard statistics
   * @param {string} userId - User ID
   * @returns {Object} Complete dashboard stats
   */
  async getDashboardStats(userId) {
    if (!this.userProgress[userId]) {
      this.initializeUserProgress(userId);
    }
    
    const progress = this.getUserProgress(userId);
    const userProg = this.userProgress[userId];
    
    // Calculate all dashboard components
    const currentProgress = this.calculateCurrentProgress(userId);
    const skillsMastery = this.calculateSkillsMastery(userId);
    const learningStreak = this.calculateLearningStreak(userId);
    const totalPoints = this.calculateTotalPoints(userId);
    const aiSuggestions = await this.generateAISuggestions(userId);
    const progressGraph = this.calculateProgressGraph(userId);
    const recentActivity = this.getRecentActivity(userId);
    const quickActions = this.getQuickActions(userId);
    
    return {
      success: true,
      data: {
        // Core metrics as requested
        currentProgress,
        skillsMastery,
        learningStreak,
        totalPoints,
        aiSuggestions,
        progressGraph,
        recentActivity,
        quickActions,
        
        // Additional dashboard info
        overview: {
          totalProgress: progress.data.overallProgress,
          completedChapters: userProg.completedChapters,
          totalChapters: userProg.totalChapters,
          currentChapter: userProg.currentChapter,
          level: progress.data.level
        },
        performance: {
          averageQuizScore: this.calculateAverageQuizScore(userId),
          learningVelocity: this.calculateLearningVelocity(userId),
          estimatedCompletion: this.getEstimatedCompletion(userId),
          totalTimeSpent: this.getTotalTimeSpent(userId)
        },
        achievements: userProg.achievements,
        lastUpdated: new Date()
      }
    };
  }

  /**
   * Calculate average quiz score
   * @param {string} userId - User ID
   * @returns {number} Average score
   */
  calculateAverageQuizScore(userId) {
    const userProg = this.userProgress[userId];
    const scores = Object.values(userProg.chapters)
      .filter(c => c.quizScore !== null)
      .map(c => c.quizScore);
    
    if (scores.length === 0) return 0;
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  // ========== NEW DASHBOARD FEATURES ==========
  
  /**
   * Calculate Current Progress: Count of completed chapters vs total roadmap chapters
   * Source: Roadmap table/collection
   * Logic: Count of completed chapters vs total roadmap chapters
   */
  calculateCurrentProgress(userId) {
    const userProg = this.userProgress[userId];
    
    const completedChapters = userProg.completedChapters || 0;
    const totalChapters = userProg.totalChapters || 10;
    const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
    
    return {
      completedChapters,
      totalChapters,
      progressPercentage,
      remainingChapters: totalChapters - completedChapters,
      currentChapter: userProg.currentChapter || 0,
      status: this.getProgressStatus(progressPercentage)
    };
  }
  
  /**
   * Calculate Skills Mastery: Roadmap chapters linked with skill categories + quiz results
   * Source: Roadmap chapters linked with skill categories + quiz results table
   * Logic: Compute average mastery percentage per skill
   */
  calculateSkillsMastery(userId) {
    if (!this.skillsData[userId]) {
      this.initializeEmptySkillsData(userId);
    }
    
    const userProg = this.userProgress[userId];
    const skills = this.skillsData[userId];
    
    const skillsMastery = {};
    
    // Calculate mastery for each skill based on chapter completion and quiz scores
    Object.keys(skills).forEach(skillName => {
      const skill = skills[skillName];
      const relatedChapters = skill.chapters || [];
      
      let completedCount = 0;
      let totalQuizScore = 0;
      let quizCount = 0;
      
      relatedChapters.forEach(chapterId => {
        const chapter = userProg.chapters[chapterId];
        if (chapter && chapter.status === 'completed') {
          completedCount++;
          if (chapter.quizScore !== null) {
            totalQuizScore += chapter.quizScore;
            quizCount++;
          }
        }
      });
      
      const completionRate = relatedChapters.length > 0 
        ? (completedCount / relatedChapters.length) * 100 
        : 0;
      const averageQuizScore = quizCount > 0 ? totalQuizScore / quizCount : 0;
      
      // Weighted mastery: 70% completion rate + 30% quiz performance
      const masteryPercentage = Math.round((completionRate * 0.7) + (averageQuizScore * 0.3));
      
      skillsMastery[skillName] = {
        skill: skillName,
        masteryPercentage,
        completedChapters: completedCount,
        totalChapters: relatedChapters.length,
        averageQuizScore: Math.round(averageQuizScore),
        level: this.getSkillLevel(masteryPercentage),
        trend: this.getSkillTrend(userId, skillName)
      };
    });
    
    return {
      skills: skillsMastery,
      overallMastery: this.calculateOverallMastery(skillsMastery),
      topSkills: this.getTopSkills(skillsMastery),
      improvementAreas: this.getImprovementAreas(skillsMastery)
    };
  }
  
  /**
   * Calculate Learning Streak: Consecutive days of learning activity
   * Source: Activity logs table (one record per learning day)
   * Logic: Consecutive days logged = streak counter
   */
  calculateLearningStreak(userId) {
    if (!this.activityLogs[userId]) {
      this.initializeEmptyActivityLogs(userId);
    }
    
    const activities = this.activityLogs[userId];
    const today = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let lastActivityDate = null;
    
    // Sort activities by date (most recent first)
    const sortedActivities = activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate current streak
    for (let i = 0; i < sortedActivities.length; i++) {
      const activityDate = new Date(sortedActivities[i].date);
      const daysDiff = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
      
      if (i === 0) {
        if (daysDiff <= 1) { // Today or yesterday
          currentStreak = 1;
          lastActivityDate = activityDate;
        } else {
          break; // Streak is broken
        }
      } else {
        const prevActivityDate = new Date(sortedActivities[i-1].date);
        const daysBetween = Math.floor((prevActivityDate - activityDate) / (1000 * 60 * 60 * 24));
        
        if (daysBetween <= 1) {
          currentStreak++;
        } else {
          break; // Streak is broken
        }
      }
    }
    
    // Calculate longest streak
    longestStreak = this.calculateLongestStreak(activities);
    
    return {
      currentStreak,
      longestStreak,
      lastActivityDate,
      weeklyActivities: this.getWeeklyActivities(userId),
      streakStatus: this.getStreakStatus(currentStreak),
      nextMilestone: this.getStreakMilestone(currentStreak)
    };
  }
  
  /**
   * Calculate Total Points from all activities
   * Source: Points log table
   * Logic: Sum of points earned for each activity (quiz, chapter, streak)
   */
  calculateTotalPoints(userId) {
    if (!this.pointsLogs[userId]) {
      this.initializeEmptyPointsLogs(userId);
    }
    
    const pointsLog = this.pointsLogs[userId];
    const userProg = this.userProgress[userId];
    
    let totalPoints = userProg.totalPoints || 0;
    
    // Categories of points
    const pointsBreakdown = {
      chapters: 0,
      quizzes: 0,
      streaks: 0,
      achievements: 0,
      bonuses: 0
    };
    
    pointsLog.forEach(entry => {
      totalPoints += entry.points;
      pointsBreakdown[entry.category] = (pointsBreakdown[entry.category] || 0) + entry.points;
    });
    
    return {
      totalPoints,
      pointsBreakdown,
      level: this.calculateLevel(totalPoints),
      rank: this.calculateUserRank(userId, totalPoints),
      pointsThisWeek: this.getPointsThisWeek(userId),
      pointsThisMonth: this.getPointsThisMonth(userId)
    };
  }
  
  /**
   * Generate AI Suggestions using Gemini with user roadmap and activity data
   * Source: Backend passes user's roadmap + activity data to Gemini
   * Logic: Gemini outputs suggestions based on weaknesses, pending chapters, or trends
   */
  async generateAISuggestions(userId) {
    try {
      const userProg = this.userProgress[userId];
      const skillsMastery = this.calculateSkillsMastery(userId);
      const learningStreak = this.calculateLearningStreak(userId);
      
      // Prepare context for Gemini
      const userContext = {
        completedChapters: userProg.completedChapters,
        totalChapters: userProg.totalChapters,
        currentChapter: userProg.currentChapter,
        averageQuizScore: this.calculateAverageQuizScore(userId),
        streak: learningStreak.currentStreak,
        skillsMastery: skillsMastery.skills,
        weakAreas: skillsMastery.improvementAreas,
        recentActivity: this.getRecentActivity(userId)
      };
      
      // Generate suggestions using Gemini
      const prompt = this.buildSuggestionPrompt(userContext);
      
      // Call Gemini service (will implement proper integration)
      const suggestions = await this.callGeminiForSuggestions(prompt);
      
      return {
        suggestions: suggestions || this.getFallbackSuggestions(userContext),
        lastUpdated: new Date(),
        context: {
          basedOnProgress: userProg.completedChapters,
          basedOnStreak: learningStreak.currentStreak,
          basedOnWeakSkills: skillsMastery.improvementAreas
        }
      };
    } catch (error) {
      console.error('AI Suggestions error:', error);
      return {
        suggestions: this.getFallbackSuggestions(),
        lastUpdated: new Date(),
        error: 'Using fallback suggestions'
      };
    }
  }
  
  /**
   * Calculate Learning Progress Graph with weekly data
   * Source: Aggregated activity log (weekly learning time + completions)
   * Logic: Generate weekly values for the line chart
   */
  calculateProgressGraph(userId) {
    if (!this.activityLogs[userId]) {
      this.initializeEmptyActivityLogs(userId);
    }
    
    const activities = this.activityLogs[userId];
    const weeks = this.getLast12Weeks();
    
    const graphData = weeks.map(week => {
      const weekActivities = activities.filter(activity => 
        this.isActivityInWeek(activity.date, week)
      );
      
      const weeklyStats = {
        week: week.label,
        startDate: week.start,
        endDate: week.end,
        chaptersCompleted: weekActivities.filter(a => a.type === 'chapter_completed').length,
        quizzesCompleted: weekActivities.filter(a => a.type === 'quiz_completed').length,
        timeSpent: weekActivities.reduce((total, a) => total + (a.timeSpent || 0), 0),
        pointsEarned: weekActivities.reduce((total, a) => total + (a.pointsEarned || 0), 0),
        activeDays: new Set(weekActivities.map(a => a.date.split('T')[0])).size
      };
      
      return weeklyStats;
    });
    
    return {
      weeklyData: graphData,
      trends: {
        averageChaptersPerWeek: this.calculateAverage(graphData.map(w => w.chaptersCompleted)),
        averageTimePerWeek: this.calculateAverage(graphData.map(w => w.timeSpent)),
        totalTimeThisMonth: this.getTotalTimeThisMonth(graphData),
        mostProductiveWeek: this.getMostProductiveWeek(graphData)
      },
      insights: this.generateProgressInsights(graphData)
    };
  }
  
  /**
   * Get Recent Activity from activity logs
   * Source: Activity log table
   * Logic: Sort by most recent timestamp
   */
  getRecentActivity(userId, limit = 10) {
    if (!this.activityLogs[userId]) {
      this.initializeEmptyActivityLogs(userId);
    }
    
    const activities = this.activityLogs[userId]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
    
    return {
      activities: activities.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        date: activity.date,
        pointsEarned: activity.pointsEarned,
        timeSpent: activity.timeSpent,
        relatedChapter: activity.chapterId,
        icon: this.getActivityIcon(activity.type)
      })),
      totalActivities: this.activityLogs[userId].length,
      todayActivities: this.getTodayActivities(userId),
      weekActivities: this.getWeekActivities(userId)
    };
  }
  
  /**
   * Get Quick Actions based on roadmap and current state
   * Source: Roadmap + current state
   * Logic: Generate contextual actions based on user progress
   */
  getQuickActions(userId) {
    const userProg = this.userProgress[userId];
    const currentProgress = this.calculateCurrentProgress(userId);
    const actions = [];
    
    // Start learning if no progress yet
    if (currentProgress.progressPercentage === 0) {
      actions.push({
        id: 'start_learning',
        title: 'Start Your Learning Journey',
        description: 'Begin with Chapter 1',
        type: 'primary',
        icon: '🚀',
        action: '/chapter/1',
        priority: 1
      });
    }
    // Continue current chapter if in progress
    else if (userProg.currentChapter && userProg.currentChapter > 0) {
      actions.push({
        id: 'continue_chapter',
        title: `Continue Chapter ${userProg.currentChapter}`,
        description: 'Pick up where you left off',
        type: 'primary',
        icon: '▶️',
        action: `/chapter/${userProg.currentChapter}`,
        priority: 1
      });
    }
    
    // Take pending quiz
    const nextQuiz = this.getNextPendingQuiz(userId);
    if (nextQuiz) {
      actions.push({
        id: 'take_quiz',
        title: `Take Quiz: ${nextQuiz.title}`,
        description: 'Test your knowledge',
        type: 'secondary',
        icon: '📝',
        action: `/quiz/${nextQuiz.id}`,
        priority: 2
      });
    }
    
    // Review weak skills
    const weakSkills = this.calculateSkillsMastery(userId).improvementAreas;
    if (weakSkills.length > 0) {
      actions.push({
        id: 'review_skills',
        title: `Review ${weakSkills[0]}`,
        description: 'Strengthen your weak areas',
        type: 'warning',
        icon: '🎯',
        action: `/skills/${weakSkills[0]}`,
        priority: 3
      });
    }
    
    // Practice exercises (only if some progress made)
    if (currentProgress.progressPercentage > 0) {
      actions.push({
        id: 'practice',
        title: 'Practice Exercises',
        description: 'Reinforce your learning',
        type: 'info',
        icon: '💪',
        action: '/practice',
        priority: 4
      });
    }
    
    // Explore roadmaps if no progress
    if (currentProgress.progressPercentage === 0) {
      actions.push({
        id: 'explore_roadmaps',
        title: 'Explore Learning Paths',
        description: 'Discover different skill roadmaps',
        type: 'info',
        icon: '🗺️',
        action: '/roadmaps',
        priority: 2
      });
    }
    // Explore advanced topics if good progress
    else if (currentProgress.progressPercentage > 50) {
      actions.push({
        id: 'explore',
        title: 'Explore Advanced Topics',
        description: 'Discover new learning paths',
        type: 'success',
        icon: '🚀',
        action: '/explore',
        priority: 5
      });
    }
    
    return {
      actions: actions.sort((a, b) => a.priority - b.priority),
      recommendedAction: actions[0] || null,
      lastUpdated: new Date()
    };
  }

  // ========== HELPER METHODS ==========
  
  // Initialize with sample data (for testing)
  initializeActivityLogs(userId) {
    this.activityLogs[userId] = [
      {
        id: 1,
        type: 'chapter_completed',
        title: 'Completed Chapter 1',
        description: 'Introduction to Programming',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        pointsEarned: 100,
        timeSpent: 120, // minutes
        chapterId: 1
      },
      {
        id: 2,
        type: 'quiz_completed',
        title: 'Quiz: Basic Concepts',
        description: 'Scored 85%',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        pointsEarned: 85,
        timeSpent: 30,
        chapterId: 1
      }
    ];
  }
  
  // Initialize with empty data (for real users)
  initializeEmptyActivityLogs(userId) {
    this.activityLogs[userId] = [];
  }
  
  // Initialize with sample data (for testing)
  initializePointsLogs(userId) {
    this.pointsLogs[userId] = [
      { category: 'chapters', points: 100, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { category: 'quizzes', points: 85, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { category: 'streaks', points: 50, date: new Date() }
    ];
  }
  
  // Initialize with empty data (for real users)
  initializeEmptyPointsLogs(userId) {
    this.pointsLogs[userId] = [];
  }
  
  // Initialize with sample skills mapping (for testing)
  initializeSkillsData(userId) {
    this.skillsData[userId] = {
      'JavaScript': { chapters: [1, 2, 3], category: 'Programming' },
      'React': { chapters: [4, 5, 6], category: 'Frontend' },
      'Node.js': { chapters: [7, 8, 9], category: 'Backend' },
      'Database': { chapters: [10], category: 'Data' }
    };
  }
  
  // Initialize with empty skills (for real users - skills mapping comes from roadmap)
  initializeEmptySkillsData(userId) {
    this.skillsData[userId] = {};
  }
  
  getProgressStatus(percentage) {
    if (percentage === 0) return 'not_started';
    if (percentage < 25) return 'just_started';
    if (percentage < 50) return 'in_progress';
    if (percentage < 75) return 'good_progress';
    if (percentage < 100) return 'almost_complete';
    return 'completed';
  }
  
  getSkillLevel(masteryPercentage) {
    if (masteryPercentage < 30) return 'beginner';
    if (masteryPercentage < 60) return 'intermediate';
    if (masteryPercentage < 85) return 'advanced';
    return 'expert';
  }
  
  calculateOverallMastery(skillsMastery) {
    const skills = Object.values(skillsMastery);
    if (skills.length === 0) return 0;
    
    const totalMastery = skills.reduce((sum, skill) => sum + skill.masteryPercentage, 0);
    return Math.round(totalMastery / skills.length);
  }
  
  getTopSkills(skillsMastery, limit = 3) {
    return Object.values(skillsMastery)
      .sort((a, b) => b.masteryPercentage - a.masteryPercentage)
      .slice(0, limit)
      .map(skill => skill.skill);
  }
  
  getImprovementAreas(skillsMastery, limit = 2) {
    return Object.values(skillsMastery)
      .sort((a, b) => a.masteryPercentage - b.masteryPercentage)
      .slice(0, limit)
      .map(skill => skill.skill);
  }
  
  getFallbackSuggestions(userContext = {}) {
    const suggestions = [
      {
        type: 'study',
        title: 'Continue Your Learning Journey',
        description: 'Keep up the momentum with your next chapter',
        priority: 'high',
        actionText: 'Continue Learning',
        actionLink: '/next-chapter'
      },
      {
        type: 'practice',
        title: 'Practice Makes Perfect',
        description: 'Reinforce your knowledge with hands-on exercises',
        priority: 'medium',
        actionText: 'Start Practice',
        actionLink: '/practice'
      },
      {
        type: 'review',
        title: 'Review Previous Topics',
        description: 'Strengthen your foundation by reviewing completed chapters',
        priority: 'low',
        actionText: 'Review Now',
        actionLink: '/review'
      }
    ];
    
    return suggestions;
  }
  
  getLast12Weeks() {
    const weeks = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const end = new Date(start.getTime() + (6 * 24 * 60 * 60 * 1000));
      
      weeks.push({
        label: `Week ${12-i}`,
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      });
    }
    
    return weeks;
  }
  
  getActivityIcon(type) {
    const icons = {
      'chapter_completed': '📚',
      'quiz_completed': '📝',
      'skill_improved': '🎯',
      'streak_milestone': '🔥',
      'achievement_earned': '🏆',
      'practice_session': '💪'
    };
    
    return icons[type] || '✅';
  }
  
  calculateLearningVelocity(userId) {
    const userProg = this.userProgress[userId];
    const daysSinceStart = Math.max(1, 
      Math.floor((new Date() - userProg.createdAt) / (1000 * 60 * 60 * 24))
    );
    return Math.round(((userProg.completedChapters / daysSinceStart) * 7) * 10) / 10;
  }
  
  getEstimatedCompletion(userId) {
    const userProg = this.userProgress[userId];
    const velocity = this.calculateLearningVelocity(userId);
    const remainingChapters = userProg.totalChapters - userProg.completedChapters;
    const daysToComplete = velocity > 0 
      ? Math.ceil(remainingChapters / (velocity / 7))
      : remainingChapters * 7;
    
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + daysToComplete);
    return estimatedDate;
  }
  
  getTotalTimeSpent(userId) {
    if (!this.activityLogs[userId]) return 0;
    return this.activityLogs[userId].reduce((total, activity) => 
      total + (activity.timeSpent || 0), 0
    );
  }
  
  // Additional helper methods
  getSkillTrend(userId, skillName) {
    // Mock trend calculation - in real implementation, compare with previous weeks
    const trends = ['improving', 'stable', 'declining'];
    return trends[Math.floor(Math.random() * trends.length)];
  }
  
  calculateLongestStreak(activities) {
    if (activities.length === 0) return 0;
    
    const sortedDates = activities
      .map(a => a.date.split('T')[0]) // Get date only
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index); // Remove duplicates
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i-1]);
      const currDate = new Date(sortedDates[i]);
      const daysDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  }
  
  getWeeklyActivities(userId) {
    if (!this.activityLogs[userId]) return 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.activityLogs[userId].filter(activity => 
      new Date(activity.date) >= oneWeekAgo
    ).length;
  }
  
  getStreakStatus(currentStreak) {
    if (currentStreak === 0) return 'broken';
    if (currentStreak < 3) return 'starting';
    if (currentStreak < 7) return 'building';
    if (currentStreak < 30) return 'strong';
    return 'legendary';
  }
  
  getStreakMilestone(currentStreak) {
    const milestones = [3, 7, 14, 30, 60, 100];
    const nextMilestone = milestones.find(m => m > currentStreak);
    return nextMilestone || milestones[milestones.length - 1];
  }
  
  buildSuggestionPrompt(userContext) {
    return `
      You are an AI learning mentor. Based on the following user data, provide 3-5 personalized learning suggestions:
      
      User Progress:
      - Completed Chapters: ${userContext.completedChapters}/${userContext.totalChapters}
      - Current Chapter: ${userContext.currentChapter}
      - Average Quiz Score: ${userContext.averageQuizScore}%
      - Learning Streak: ${userContext.streak} days
      - Weak Skills: ${userContext.weakAreas?.join(', ') || 'None identified'}
      
      Please provide practical, actionable suggestions to help this user improve their learning journey.
      Format each suggestion with: type, title, description, priority, actionText, actionLink
    `;
  }
  
  async callGeminiForSuggestions(prompt) {
    try {
      // Gemini service temporarily disabled due to syntax errors
      // Will use fallback suggestions for now
      return null;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      return null;
    }
  }
  
  parseSuggestionsFromResponse(response) {
    // Parse Gemini response into structured suggestions
    // This is a simplified parser - real implementation would be more robust
    try {
      const suggestions = [];
      // Mock parsing logic here
      return suggestions;
    } catch (error) {
      return null;
    }
  }
  
  isActivityInWeek(activityDate, week) {
    const date = new Date(activityDate).toISOString().split('T')[0];
    return date >= week.start && date <= week.end;
  }
  
  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return Math.round(numbers.reduce((sum, num) => sum + num, 0) / numbers.length);
  }
  
  getTotalTimeThisMonth(graphData) {
    const thisMonth = new Date().getMonth();
    return graphData
      .filter(week => new Date(week.startDate).getMonth() === thisMonth)
      .reduce((total, week) => total + week.timeSpent, 0);
  }
  
  getMostProductiveWeek(graphData) {
    if (graphData.length === 0) return null;
    
    return graphData.reduce((mostProductive, week) => {
      const currentScore = week.chaptersCompleted * 100 + week.timeSpent;
      const bestScore = mostProductive.chaptersCompleted * 100 + mostProductive.timeSpent;
      return currentScore > bestScore ? week : mostProductive;
    });
  }
  
  generateProgressInsights(graphData) {
    const insights = [];
    
    const recentWeeks = graphData.slice(-4); // Last 4 weeks
    const averageChapters = this.calculateAverage(recentWeeks.map(w => w.chaptersCompleted));
    
    if (averageChapters > 2) {
      insights.push('You\'re maintaining excellent progress! Keep up the great work.');
    } else if (averageChapters > 1) {
      insights.push('Good steady progress. Consider setting small daily goals to boost your pace.');
    } else {
      insights.push('Your learning pace has slowed down. Try setting aside dedicated time each day.');
    }
    
    const totalTime = recentWeeks.reduce((sum, w) => sum + w.timeSpent, 0);
    if (totalTime < 240) { // Less than 4 hours per month
      insights.push('Consider increasing your study time for better retention and progress.');
    }
    
    return insights;
  }
  
  getTodayActivities(userId) {
    if (!this.activityLogs[userId]) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    return this.activityLogs[userId].filter(activity => 
      activity.date.split('T')[0] === today
    ).length;
  }
  
  getWeekActivities(userId) {
    return this.getWeeklyActivities(userId);
  }
  
  getNextPendingQuiz(userId) {
    const userProg = this.userProgress[userId];
    const currentChapter = userProg.currentChapter;
    
    // Mock quiz data - in real implementation, this would come from database
    const availableQuizzes = [
      { id: 1, title: 'JavaScript Basics', chapterRequired: 1 },
      { id: 2, title: 'Functions & Scope', chapterRequired: 2 },
      { id: 3, title: 'Async Programming', chapterRequired: 3 }
    ];
    
    return availableQuizzes.find(quiz => 
      quiz.chapterRequired <= currentChapter && 
      !userProg.chapters[quiz.chapterRequired]?.quizScore
    ) || null;
  }
  
  calculateUserRank(userId, totalPoints) {
    // Mock ranking system - in real implementation, compare with all users
    const ranks = [
      { name: 'Bronze', minPoints: 0, color: '#CD7F32' },
      { name: 'Silver', minPoints: 1000, color: '#C0C0C0' },
      { name: 'Gold', minPoints: 3000, color: '#FFD700' },
      { name: 'Platinum', minPoints: 7000, color: '#E5E4E2' },
      { name: 'Diamond', minPoints: 15000, color: '#B9F2FF' }
    ];
    
    let currentRank = ranks[0];
    for (const rank of ranks) {
      if (totalPoints >= rank.minPoints) {
        currentRank = rank;
      }
    }
    
    const nextRank = ranks[ranks.findIndex(r => r.name === currentRank.name) + 1];
    
    return {
      current: currentRank,
      next: nextRank,
      pointsToNext: nextRank ? nextRank.minPoints - totalPoints : 0,
      percentToNext: nextRank ? Math.round(((totalPoints - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100) : 100
    };
  }
  
  getPointsThisWeek(userId) {
    if (!this.pointsLogs[userId]) return 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.pointsLogs[userId]
      .filter(entry => new Date(entry.date) >= oneWeekAgo)
      .reduce((total, entry) => total + entry.points, 0);
  }
  
  getPointsThisMonth(userId) {
    if (!this.pointsLogs[userId]) return 0;
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return this.pointsLogs[userId]
      .filter(entry => new Date(entry.date) >= oneMonthAgo)
      .reduce((total, entry) => total + entry.points, 0);
  }
  
  /**
   * Log a learning activity for the user
   * @param {string} userId - User ID
   * @param {Object} activityData - Activity data
   * @returns {Object} Log result
   */
  logActivity(userId, activityData) {
    if (!this.activityLogs[userId]) {
      this.initializeEmptyActivityLogs(userId);
    }
    
    const activity = {
      id: Date.now(),
      type: activityData.type,
      title: activityData.title,
      description: activityData.description,
      date: new Date().toISOString(),
      timeSpent: activityData.timeSpent || 0,
      pointsEarned: activityData.pointsEarned || 0,
      chapterId: activityData.chapterId
    };
    
    this.activityLogs[userId].push(activity);
    
    // Also log points if earned
    if (activityData.pointsEarned) {
      this.logPoints(userId, activityData.type, activityData.pointsEarned);
    }
    
    return {
      success: true,
      data: activity
    };
  }
  
  /**
   * Log points for a user activity
   * @param {string} userId - User ID
   * @param {string} category - Points category
   * @param {number} points - Points earned
   */
  logPoints(userId, category, points) {
    if (!this.pointsLogs[userId]) {
      this.initializeEmptyPointsLogs(userId);
    }
    
    this.pointsLogs[userId].push({
      category: this.mapActivityToPointsCategory(category),
      points,
      date: new Date()
    });
    
    // Update user total points
    if (this.userProgress[userId]) {
      this.userProgress[userId].totalPoints += points;
    }
  }
  
  /**
   * Map activity type to points category
   * @param {string} activityType - Activity type
   * @returns {string} Points category
   */
  mapActivityToPointsCategory(activityType) {
    const mapping = {
      'chapter_completed': 'chapters',
      'quiz_completed': 'quizzes',
      'streak_milestone': 'streaks',
      'achievement_earned': 'achievements',
      'practice_session': 'bonuses'
    };
    
    return mapping[activityType] || 'bonuses';
  }
  
  /**
   * Get detailed progress analytics
   * @param {string} userId - User ID
   * @returns {Object} Analytics data
   */
  async getProgressAnalytics(userId) {
    const dashboardData = await this.getDashboardStats(userId);
    
    return {
      success: true,
      data: {
        ...dashboardData.data,
        detailedMetrics: {
          weeklyBreakdown: this.getWeeklyBreakdown(userId),
          skillProgressTrends: this.getSkillProgressTrends(userId),
          timeAnalysis: this.getTimeAnalysis(userId),
          comparisonMetrics: this.getComparisonMetrics(userId)
        }
      }
    };
  }
  
  /**
   * Get weekly activity breakdown
   * @param {string} userId - User ID
   * @returns {Object} Weekly breakdown
   */
  getWeeklyBreakdown(userId) {
    if (!this.activityLogs[userId]) return [];
    
    const weeks = this.getLast12Weeks();
    
    return weeks.map(week => {
      const weekActivities = this.activityLogs[userId].filter(activity => 
        this.isActivityInWeek(activity.date, week)
      );
      
      return {
        week: week.label,
        activities: weekActivities.length,
        timeSpent: weekActivities.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
        pointsEarned: weekActivities.reduce((sum, a) => sum + (a.pointsEarned || 0), 0),
        chaptersCompleted: weekActivities.filter(a => a.type === 'chapter_completed').length,
        quizzesCompleted: weekActivities.filter(a => a.type === 'quiz_completed').length
      };
    });
  }
  
  /**
   * Get skill progress trends over time
   * @param {string} userId - User ID
   * @returns {Object} Skill trends
   */
  getSkillProgressTrends(userId) {
    const skillsMastery = this.calculateSkillsMastery(userId);
    
    return {
      currentMastery: skillsMastery,
      trends: Object.keys(skillsMastery.skills).map(skillName => ({
        skill: skillName,
        trend: this.getSkillTrend(userId, skillName),
        weeklyProgress: this.getWeeklySkillProgress(userId, skillName)
      }))
    };
  }
  
  /**
   * Get time analysis data
   * @param {string} userId - User ID
   * @returns {Object} Time analysis
   */
  getTimeAnalysis(userId) {
    const totalTime = this.getTotalTimeSpent(userId);
    const weeklyTime = this.getPointsThisWeek(userId);
    const monthlyTime = this.getPointsThisMonth(userId);
    
    return {
      totalTimeSpent: totalTime,
      averageSessionLength: totalTime / Math.max(1, this.activityLogs[userId]?.length || 1),
      weeklyTime,
      monthlyTime,
      mostActiveHours: this.getMostActiveHours(userId),
      consistencyScore: this.calculateConsistencyScore(userId)
    };
  }
  
  /**
   * Get comparison metrics (user vs average)
   * @param {string} userId - User ID
   * @returns {Object} Comparison metrics
   */
  getComparisonMetrics(userId) {
    // Mock comparison data - in real implementation, compare with other users
    const userProgress = this.calculateCurrentProgress(userId);
    
    return {
      progressVsAverage: {
        user: userProgress.progressPercentage,
        average: 45, // Mock average
        percentile: Math.min(95, userProgress.progressPercentage + 10)
      },
      streakVsAverage: {
        user: this.calculateLearningStreak(userId).currentStreak,
        average: 7,
        percentile: 75
      },
      pointsVsAverage: {
        user: this.calculateTotalPoints(userId).totalPoints,
        average: 2500,
        percentile: 80
      }
    };
  }
  
  // Additional helper methods for analytics
  getWeeklySkillProgress(userId, skillName) {
    // Mock weekly skill progress - in real implementation, track skill progress over time
    return Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      progress: Math.min(100, (i + 1) * 8 + Math.random() * 10)
    }));
  }
  
  getMostActiveHours(userId) {
    // Mock most active hours - in real implementation, analyze activity timestamps
    return [
      { hour: 9, activities: 15 },
      { hour: 14, activities: 12 },
      { hour: 20, activities: 18 }
    ];
  }
  
  calculateConsistencyScore(userId) {
    if (!this.activityLogs[userId] || this.activityLogs[userId].length === 0) return 0;
    
    const activities = this.activityLogs[userId];
    const uniqueDays = new Set(activities.map(a => a.date.split('T')[0])).size;
    const totalDays = Math.max(1, Math.floor((new Date() - new Date(activities[0].date)) / (1000 * 60 * 60 * 24)));
    
    return Math.round((uniqueDays / totalDays) * 100);
  }
}

module.exports = new ProgressTrackingService();
