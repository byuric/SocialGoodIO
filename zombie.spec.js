var Browser = require('zombie');
var url = 'http://localhost:3000';
var browser = new Browser();

describe('Sign Up', function() {
  it('email', function(next) {
    browser.visit(url, function(error) {
      browser.clickLink('Sign Up', function() {
        expect(browser.text('title')).toBe('Create Account - SocialGood.io');
        browser.fill('Name', 'Test User');
        browser.fill('Email', 'test.user@example.com');
        browser.fill('Password', 'password');
        browser.fill('Confirm Password', 'password');
        browser.pressButton('Signup', function() {
          console.log(browser.window.location.pathname);
          next();
        });
      });
    });
  });
});

describe('Projects', function() {
  it('index', function(next) {
    browser.visit(url, function(error) {
      browser.clickLink('Projects', function() {
        expect(browser.text('title')).toBe('Project list - SocialGood.io');
        next();
      });
    });
  });

  it('create', function(next) {
    browser.visit(url, function(error) {
      browser.clickLink('Create Project', function() {
        expect(browser.text('title')).toBe('Login - SocialGood.io');
        next();
      });
    });
  });
});