import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/auth';
import { errorHandler } from '../../middleware/error-handler';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use(errorHandler);

describe('Auth API Integration Tests', () => {
  it('should reject invalid register payload', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'bad-email' });
    
    expect(res.status).toBe(400);
  });

  it('should successfully register a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: `test-${Date.now()}@motowash.com`,
        password: 'Password@123',
        fullName: 'Test User',
        phone: '0812345678'
      });
    
    expect(res.status).toBe(201);
  });
});
