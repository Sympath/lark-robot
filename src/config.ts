export interface Config {
  // Feishu App Configuration
  appId: string;
  appSecret: string;
  verificationToken: string;
  
  // Server Configuration
  port: number;
  
  // Environment Configuration
  environment: string;
  host: string;
}

const config: Config = {
  // Feishu App Configuration
  appId: 'cli_a8079e4490b81013',
  appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
  verificationToken: 'glqekPS9pO55cF0bHfSEZbogArkR8inu',
  
  // Server Configuration
  port: parseInt(process.env.PORT || '3000'),
  
  // Environment Configuration
  environment: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '47.120.11.77'
};

export default config; 