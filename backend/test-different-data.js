// Test if backend generates different data for different skills

async function testDifferentData() {
  console.log('🧪 TESTING DIFFERENT DATA GENERATION');
  console.log('='*50);
  
  const skills = ['Mobile Development', 'Data Science', 'Python', 'React'];
  const results = [];
  
  for (const skill of skills) {
    console.log(`\n📱 Testing: ${skill}`);
    console.log('-'*30);
    
    try {
      const response = await fetch(`http://localhost:5000/api/analytics/market/dynamic?skill=${encodeURIComponent(skill)}&location=India`);
      const data = await response.json();
      
      if (data.success) {
        const result = {
          skill: data.data.skill,
          salary: data.data.marketOverview?.averageSalary,
          growth: data.data.marketOverview?.growthRate,
          jobOpenings: data.data.marketOverview?.jobOpenings,
          demandLevel: data.data.marketOverview?.demandLevel,
          salaryProgression: data.data.graphData?.salaryProgression?.[0]?.salary,
          demandTrend: data.data.graphData?.demandTrend?.[0]?.demand
        };
        
        results.push(result);
        
        console.log(`✅ ${skill}:`);
        console.log(`   Salary: ${result.salary}`);
        console.log(`   Growth: ${result.growth}`);
        console.log(`   Job Openings: ${result.jobOpenings}`);
        console.log(`   Demand Level: ${result.demandLevel}`);
        console.log(`   Entry Salary (Chart): ${result.salaryProgression}`);
        console.log(`   Demand Trend Start: ${result.demandTrend}`);
      } else {
        console.log(`❌ Failed for ${skill}`);
      }
    } catch (error) {
      console.log(`❌ Error for ${skill}:`, error.message);
    }
  }
  
  console.log('\n' + '='*50);
  console.log('📊 COMPARISON ANALYSIS:');
  console.log('='*50);
  
  // Check if all values are different
  const salaries = results.map(r => r.salary);
  const growthRates = results.map(r => r.growth);
  const jobOpenings = results.map(r => r.jobOpenings);
  
  const uniqueSalaries = [...new Set(salaries)];
  const uniqueGrowth = [...new Set(growthRates)];
  const uniqueJobs = [...new Set(jobOpenings)];
  
  console.log(`\n💰 Salary Diversity: ${uniqueSalaries.length}/${results.length} unique values`);
  console.log(`   Values: ${salaries.join(', ')}`);
  
  console.log(`\n📈 Growth Rate Diversity: ${uniqueGrowth.length}/${results.length} unique values`);
  console.log(`   Values: ${growthRates.join(', ')}`);
  
  console.log(`\n💼 Job Openings Diversity: ${uniqueJobs.length}/${results.length} unique values`);
  console.log(`   Values: ${jobOpenings.join(', ')}`);
  
  const isWorking = uniqueSalaries.length > 1 && uniqueGrowth.length > 1 && uniqueJobs.length > 1;
  
  console.log(`\n${isWorking ? '🎉 SUCCESS' : '❌ PROBLEM'}: ${isWorking ? 'Each skill shows different data!' : 'Skills are showing same data!'}`);
  
  if (!isWorking) {
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('- Check if improvedGeminiService is being used');
    console.log('- Verify skill-specific logic in getEnhancedFallbackAnalytics');
    console.log('- Check if API is calling the right service method');
  }
}

testDifferentData().catch(console.error);
