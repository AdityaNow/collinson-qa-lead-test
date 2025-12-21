module.exports = {
  default: {
    requireModule: ['ts-node/register'], // Load TypeScript support
    require: ['src/steps/*.ts', 'src/support/*.ts'], // Where step definitions live
    paths: ['features/*.feature'], // Where Gherkin files live
    format: ['progress-bar', 'html:reports/cucumber-report.html'], // Nice reporting
  }
};