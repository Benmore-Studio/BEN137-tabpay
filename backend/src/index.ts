import { config } from './config';
import { createApp, prisma } from './app';

const app = createApp();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(config.port, () => {
  console.info(`TabPay Backend running on port ${config.port} in ${config.env} mode`);
});

export { prisma };
