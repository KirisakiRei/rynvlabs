import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'rynvlabs CMS API',
      version: '1.0.0',
      description: 'Backend API for rynvlabs website and CMS',
      endpoints: {
        public: ['/api/projects', '/api/products', '/api/academy', '/api/landing-sections', '/api/site-settings'],
        admin: ['/admin/*'],
        auth: ['/auth/login'],
      },
      documentation: 'Contact admin for API documentation',
      timestamp: new Date().toISOString(),
    };
  }
}
