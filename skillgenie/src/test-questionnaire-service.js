import questionnaireService from './services/questionnaireService';

// Test all questionnaireService methods
function testQuestionnaireService() {
  console.log('🧪 Testing QuestionnaireService methods...\n');

  // Test with mock data first
  const mockData = {
    preferredDomains: ['ai_ml', 'web_dev'],
    experience: 'some_experience',
    education: 'bachelor',
    careerGoals: 'Become a full-stack developer',
    timeCommitment: 'part_time',
    learningStyle: 'practical',
    location: 'India'
  };

  // Test save and retrieve
  console.log('1. Testing saveQuestionnaireData...');
  const savedData = questionnaireService.saveQuestionnaireData(mockData);
  console.log('✅ Saved data:', savedData ? 'Success' : 'Failed');

  console.log('\n2. Testing getQuestionnaireData...');
  const retrievedData = questionnaireService.getQuestionnaireData();
  console.log('✅ Retrieved data:', retrievedData ? 'Success' : 'Failed');

  console.log('\n3. Testing getPrimarySkillRecommendation...');
  const primarySkill = questionnaireService.getPrimarySkillRecommendation();
  console.log('✅ Primary skill:', primarySkill);

  console.log('\n4. Testing getExperienceLevel...');
  const experienceLevel = questionnaireService.getExperienceLevel();
  console.log('✅ Experience level:', experienceLevel);

  console.log('\n5. Testing getLocationRecommendation...');
  const location = questionnaireService.getLocationRecommendation();
  console.log('✅ Location recommendation:', location);

  console.log('\n6. Testing getDetailedLocationRecommendations...');
  const detailedLocation = questionnaireService.getDetailedLocationRecommendations();
  console.log('✅ Detailed location data:', detailedLocation ? 'Success' : 'Failed');

  console.log('\n7. Testing generatePersonalizedRecommendations...');
  const recommendations = questionnaireService.generatePersonalizedRecommendations();
  console.log('✅ Personalized recommendations:', recommendations ? 'Success' : 'Failed');

  console.log('\n8. Testing getAllPreferredSkills...');
  const allSkills = questionnaireService.getAllPreferredSkills();
  console.log('✅ All preferred skills:', allSkills);

  console.log('\n9. Testing hasCompletedQuestionnaire...');
  const hasCompleted = questionnaireService.hasCompletedQuestionnaire();
  console.log('✅ Has completed questionnaire:', hasCompleted);

  console.log('\n🎉 All QuestionnaireService methods tested successfully!');
  
  // Test without data
  console.log('\n🧪 Testing with no questionnaire data...');
  questionnaireService.clearQuestionnaireData();
  
  const noDataSkill = questionnaireService.getPrimarySkillRecommendation();
  const noDataLocation = questionnaireService.getLocationRecommendation();
  
  console.log('✅ Default skill (no data):', noDataSkill);
  console.log('✅ Default location (no data):', noDataLocation);
}

// Export for use in components
export { testQuestionnaireService };
