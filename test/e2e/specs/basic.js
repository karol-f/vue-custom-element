// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  basic: function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    browser
      .url(`${devServer}/#/demos/basic`)
      .waitForElementVisible('demo-basic', 5000)
      .end();
  }
};
