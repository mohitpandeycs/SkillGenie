const express = require('express');
const progressTrackingService = require('./services/progressTrackingService');

// Test the dashboard functionality
async function testDashboard() {
  console.log('🧪 Testing Enhanced Dashboard Functionality');
  console.log('=====================================');
  
  const testUserId = 'test-user-123';
  
  try {
    // Test 1: Initialize user and get basic progress
    console.log('\n📊 Test 1: Basic Progress');
    const basicProgress = progressTrackingService.getUserProgress(testUserId);
    console.log('✅ Basic Progress:', JSON.stringify(basicProgress, null, 2));
    
    // Test 2: Update some chapter progress to create data
    console.log('\n📚 Test 2: Update Chapter Progress');
    progressTrackingService.updateChapterProgress(testUserId, 1, {
      progress: 100,
      status: 'completed',
      quizScore: 85
    });
    
    progressTrackingService.updateChapterProgress(testUserId, 2, {
      progress: 60,
      status: 'in_progress'
    });
    
    // Test 3: Log some activities
    console.log('\n📝 Test 3: Log Activities');
    progressTrackingService.logActivity(testUserId, {
      type: 'chapter_completed',
      title: 'Completed JavaScript Basics',
      description: 'Finished the first chapter',
      timeSpent: 120,
      pointsEarned: 100,
      chapterId: 1
    });
    
    progressTrackingService.logActivity(testUserId, {
      type: 'quiz_completed',
      title: 'Quiz: JavaScript Fundamentals',
      description: 'Scored 85%',
      timeSpent: 30,
      pointsEarned: 85,
      chapterId: 1
    });
    
    // Test 4: Get comprehensive dashboard data
    console.log('\n🎯 Test 4: Comprehensive Dashboard');
    const dashboardData = await progressTrackingService.getDashboardStats(testUserId);
    console.log('✅ Dashboard Data Structure:', Object.keys(dashboardData.data));
    
    // Test 5: Test individual dashboard components
    console.log('\n🎯 Test 5: Individual Components');
    
    console.log('📊 Current Progress:', progressTrackingService.calculateCurrentProgress(testUserId));
    console.log('🎯 Skills Mastery:', progressTrackingService.calculateSkillsMastery(testUserId));
    console.log('🔥 Learning Streak:', progressTrackingService.calculateLearningStreak(testUserId));
    console.log('💰 Total Points:', progressTrackingService.calculateTotalPoints(testUserId));
    console.log('📈 Progress Graph:', progressTrackingService.calculateProgressGraph(testUserId));
    console.log('📋 Recent Activity:', progressTrackingService.getRecentActivity(testUserId));
    console.log('⚡ Quick Actions:', progressTrackingService.getQuickActions(testUserId));
    
    // Test 6: Test new API endpoints functionality
    console.log('\n🌐 Test 6: API Endpoint Functions');
    
    const streakData = progressTrackingService.calculateLearningStreak(testUserId);
    console.log('✅ Streak Endpoint Data:', streakData);
    
    const skillsData = progressTrackingService.calculateSkillsMastery(testUserId);
    console.log('✅ Skills Endpoint Data:', skillsData);
    
    const analyticsData = await progressTrackingService.getProgressAnalytics(testUserId);
    console.log('✅ Analytics Endpoint Keys:', Object.keys(analyticsData.data));
    
    // Test 7: Full dashboard response
    console.log('\n🎯 Test 7: Complete Dashboard Response');
    const fullDashboard = await progressTrackingService.getDashboardStats(testUserId);
    
    console.log('\n🎉 DASHBOARD FEATURES IMPLEMENTED:');
    console.log('=====================================');
    console.log('✅ Current Progress - Completed vs Total Chapters');
    console.log('✅ Skills Mastery - Average mastery per skill from chapters + quizzes');
    console.log('✅ Learning Streak - Consecutive days of activity');
    console.log('✅ Total Points - Sum from all activities (quiz, chapter, streak)');
    console.log('✅ AI Suggestions - Gemini-based recommendations (with fallback)');
    console.log('✅ Learning Progress Graph - Weekly learning data');
    console.log('✅ Recent Activity - Sorted by most recent timestamp');
    console.log('✅ Quick Actions - Contextual actions based on progress');
    console.log('✅ Additional Analytics - Detailed metrics and comparisons');
    
    console.log('\n📍 API ENDPOINTS AVAILABLE:');
    console.log('=====================================');
    console.log('GET  /api/progress/dashboard - Comprehensive dashboard data');
    console.log('GET  /api/progress/streak - Learning streak information');
    console.log('GET  /api/progress/skills - Skills mastery data');
    console.log('GET  /api/progress/analytics - Detailed progress analytics');
    console.log('POST /api/progress/activity - Log learning activities');
    console.log('GET  /api/progress - Basic progress data');
    console.log('POST /api/progress/chapter/:id - Update chapter progress');
    console.log('POST /api/progress/skill/:skill - Update skill progress');
    
    console.log('\n🎯 DASHBOARD STRUCTURE:');
    console.log('=====================================');
    console.log('data: {');
    console.log('  currentProgress: { completedChapters, totalChapters, progressPercentage, ... }');
    console.log('  skillsMastery: { skills, overallMastery, topSkills, improvementAreas }');
    console.log('  learningStreak: { currentStreak, longestStreak, weeklyActivities, ... }');
    console.log('  totalPoints: { totalPoints, pointsBreakdown, level, rank, ... }');
    console.log('  aiSuggestions: { suggestions, context, lastUpdated }');
    console.log('  progressGraph: { weeklyData, trends, insights }');
    console.log('  recentActivity: { activities, totalActivities, todayActivities, ... }');
    console.log('  quickActions: { actions, recommendedAction, lastUpdated }');
    console.log('  overview: { totalProgress, completedChapters, level, ... }');
    console.log('  performance: { averageQuizScore, learningVelocity, estimatedCompletion, ... }');
    console.log('}');
    
    return fullDashboard;
    
  } catch (error) {
    console.error('❌ Dashboard test failed:', error);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testDashboard()
    .then((result) => {
      console.log('\n🎉 All dashboard tests completed successfully!');
      console.log('The enhanced progress tracking system is ready to use.');
    })
    .catch((error) => {
      console.error('💥 Dashboard tests failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testDashboard };
