import app from './app';
import { connectDB, disconnectDB } from './config/db';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Attempt DB connection
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 [Somity Backend] Server running on http://localhost:${PORT}`);
      console.log(`🩺 [Health Check] Available at http://localhost:${PORT}/api/v1/health`);
    });

    // Graceful Shutdown handlers
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('🔒 Closed out remaining HTTP connections.');
        try {
          await disconnectDB();
          console.log('📦 Disconnected from MongoDB.');
          process.exit(0);
        } catch (err) {
          console.error('❌ Error during database disconnect:', err);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds if lingering connections exist
      setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('💥 Fatal error starting Somity Backend server:', error);
    process.exit(1);
  }
}

bootstrap();

