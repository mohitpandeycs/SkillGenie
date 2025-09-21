const dynamicRoadmapService = require('./services/dynamicRoadmapService');
require('dotenv').config();

async function testDynamicServices() {
  console.log('🚀 Testing Dynamic Services with Gemini AI...\n');

  // Test 1: Generate Dynamic Roadmap
  console.log('1. Testing Dynamic Roadmap Generation...');
  console.log('='*50);
  try {
    const roadmap = await dynamicRoadmapService.generateRoadmap('Python', 'beginner', '3-6 months');
    
    if (roadmap.success) {
      console.log('✅ Roadmap generated successfully!');
      console.log('Title:', roadmap.data.title);
      console.log('Duration:', roadmap.data.totalDuration);
      console.log('Chapters:', roadmap.data.chapters.length);
      console.log('Prerequisites:', roadmap.data.prerequisites);
      console.log('Career Outcomes:', roadmap.data.careerOutcomes);
      console.log('Salary Range:', roadmap.data.estimatedSalaryRange);
      
      // Show first chapter
      if (roadmap.data.chapters[0]) {
        const chapter = roadmap.data.chapters[0];
        console.log('\nFirst Chapter:');
        console.log('  - Title:', chapter.title);
        console.log('  - Description:', chapter.description);
        console.log('  - Duration:', chapter.duration);
        console.log('  - Topics:', chapter.topics);
        console.log('  - YouTube Videos:', chapter.youtubeVideos ? chapter.youtubeVideos.length : 0);
      }
    } else {
      console.log('❌ Failed to generate roadmap');
    }
  } catch (error) {
    console.log('❌ Error generating roadmap:', error.message);
  }

  console.log('\n' + '='*50 + '\n');

  // Test 2: Generate Dynamic Analytics
  console.log('2. Testing Dynamic Analytics Generation...');
  console.log('='*50);
  try {
    const analytics = await dynamicRoadmapService.generateAnalytics('JavaScript', 'USA');
    
    if (analytics.success) {
      console.log('✅ Analytics generated successfully!');
      console.log('Skill:', analytics.data.skill);
      console.log('Location:', analytics.data.location);
      console.log('\nMarket Overview:');
      console.log('  - Demand Level:', analytics.data.marketOverview.demandLevel);
      console.log('  - Growth Rate:', analytics.data.marketOverview.growthRate);
      console.log('  - Average Salary:', analytics.data.marketOverview.averageSalary);
      console.log('  - Job Openings:', analytics.data.marketOverview.jobOpenings);
      
      if (analytics.data.topCompanies && analytics.data.topCompanies.length > 0) {
        console.log('\nTop Companies:');
        analytics.data.topCompanies.slice(0, 3).forEach(company => {
          console.log(`  - ${company.name}: ${company.openings} openings, ${company.averageSalary}`);
        });
      }
      
      if (analytics.data.graphData) {
        console.log('\nGraph Data Available:');
        console.log('  - Salary Progression:', analytics.data.graphData.salaryProgression ? '✓' : '✗');
        console.log('  - Demand Trend:', analytics.data.graphData.demandTrend ? '✓' : '✗');
        console.log('  - Skill Distribution:', analytics.data.graphData.skillDistribution ? '✓' : '✗');
      }
    } else {
      console.log('❌ Failed to generate analytics');
    }
  } catch (error) {
    console.log('❌ Error generating analytics:', error.message);
  }

  console.log('\n' + '='*50);
  console.log('\n🎉 Dynamic Services Testing Complete!');
}

// Run the test
if (require.main === module) {
  testDynamicServices().catch(console.error);
}

module.exports = testDynamicServices;
