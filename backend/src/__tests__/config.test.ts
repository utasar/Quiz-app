import { config } from '../config/config';

describe('Configuration', () => {
  it('should have required configuration values', () => {
    expect(config.port).toBeDefined();
    expect(config.mongoUri).toBeDefined();
    expect(config.jwtSecret).toBeDefined();
    expect(config.jwtExpiration).toBeDefined();
  });

  it('should have correct default port', () => {
    expect(config.port).toBe(5000);
  });

  it('should have JWT expiration defined', () => {
    expect(config.jwtExpiration).toBe('7d');
  });
});
