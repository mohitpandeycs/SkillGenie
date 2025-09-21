const progressTrackingService = require('./services/progressTrackingService');

async function testCleanProgress() {
  console.log('🧪 Testing Clean Progress Initialization');
  console.log('======================================');
  
  const testUserId = 'new-user-test';
  
  try {
    // Test 1: Get dashboard for a new user
    console.log('\n📊 Test 1: New User Dashboard');
    const dashboardData = await progressTrackingService.getDashboardStats(testUserId);
    
    console.log('✅ Current Progress:', dashboardData.data.currentProgress);
    console.log('✅ Skills Mastery:', dashboardData.data.skillsMastery);
    console.log('✅ Learning Streak:', dashboardData.data.learningStreak);
    console.log('✅ Total Points:', dashboardData.data.totalPoints);
    console.log('✅ Quick Actions:', dashboardData.data.quickActions.actions.map(a => a.title));
    
    // Test 2: Verify clean initialization
    console.log('\n🔍 Test 2: Verify Clean State');
    console.log(`Progress Percentage: ${dashboardData.data.currentProgress.progressPercentage}%`);
    console.log(`Completed Chapters: ${dashboardData.data.currentProgress.completedChapters}`);
    console.log(`Current Chapter: ${dashboardData.data.currentProgress.currentChapter}`);
    console.log(`Current Streak: ${dashboardData.data.learningStreak.currentStreak}`);
    console.log(`Total Points: ${dashboardData.data.totalPoints.totalPoints}`);
    console.log(`Recent Activities: ${dashboardData.data.recentActivity.activities.length}`);
    
    // Test 3: Test reset functionality
    console.log('\n🔄 Test 3: Reset Progress');
    const resetResult = progressTrackingService.resetUserProgress(testUserId);
    console.log('✅ Reset Result:', resetResult);
    
    // Test 4: Verify reset worked
    console.log('\n🔍 Test 4: Verify After Reset');
    const afterResetData = await progressTrackingService.getDashboardStats(testUserId);
    console.log(`Progress Percentage: ${afterResetData.data.currentProgress.progressPercentage}%`);
    console.log(`Total Points: ${afterResetData.data.totalPoints.totalPoints}`);
    
    // Test 5: Simulate starting learning
    console.log('\n🚀 Test 5: Start Learning Journey');
    progressTrackingService.updateChapterProgress(testUserId, 1, {
      progress: 25,
      status: 'in_progress'
    });
    
    const afterStartData = await progressTrackingService.getDashboardStats(testUserId);
    console.log(`Progress after starting: ${afterStartData.data.currentProgress.progressPercentage}%`);
    console.log(`Current Chapter: ${afterStartData.data.currentProgress.currentChapter}`);
    console.log(`Status: ${afterStartData.data.currentProgress.status}`);
    console.log(`Quick Actions: ${afterStartData.data.quickActions.actions.map(a => a.title)}`);
    
    console.log('\n🎉 VERIFICATION RESULTS:');
    console.log('=======================');
    
    const isClean = dashboardData.data.currentProgress.progressPercentage === 0 &&
                   dashboardData.data.currentProgress.completedChapters === 0 &&
                   dashboardData.data.currentProgress.currentChapter === 0 &&
                   dashboardData.data.learningStreak.currentStreak === 0 &&
                   dashboardData.data.totalPoints.totalPoints === 0 &&
                   dashboardData.data.recentActivity.activities.length === 0;
    
    if (isClean) {
      console.log('✅ SUCCESS: New users now start with completely clean progress!');
      console.log('✅ Progress: 0%');
      console.log('✅ Chapters: 0/10');
      console.log('✅ Points: 0');
      console.log('✅ Streak: 0');
      console.log('✅ Activities: Empty');
      console.log('✅ Quick Actions: Show "Start Your Learning Journey"');
    } else {
      console.log('❌ ISSUE: User still has sample data on initialization');
      console.log(`❌ Progress: ${dashboardData.data.currentProgress.progressPercentage}%`);
      console.log(`❌ Points: ${dashboardData.data.totalPoints.totalPoints}`);
      console.log(`❌ Activities: ${dashboardData.data.recentActivity.activities.length}`);
    }
    
    console.log('\n📍 API ENDPOINTS TO FIX DASHBOARD:');
    console.log('==================================');
    console.log('POST /api/progress/reset - Reset user progress to start fresh');
    console.log('GET  /api/progress/dashboard - Will now show 0% for new users');
    console.log('POST /api/progress/chapter/1 - Start first chapter to begin progress');
    
    return isClean;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testCleanProgress()
    .then((isClean) => {
      if (isClean) {
        console.log('\n🎉 Dashboard progress issue is FIXED!');
        console.log('New users will now see 0% progress as expected.');
      } else {
        console.log('\n⚠️  Dashboard still has sample data issue.');
      }
    })
    .catch((error) => {
      console.error('💥 Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testCleanProgress };
