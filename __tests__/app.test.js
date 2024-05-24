const request = require('supertest');
const app = require('../index'); // Adjust the path to your main server file

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});