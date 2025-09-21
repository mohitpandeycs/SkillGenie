// Simple test to check class syntax
class TestClass {
  constructor() {
    console.log('test');
  }

  method1() {
    return {
      success: true,
      data: {
        test: "value"
      }
    };
  }

  method2() {
    console.log('method2');
  }
}

module.exports = new TestClass();
