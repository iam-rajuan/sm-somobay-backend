import mongoose from 'mongoose';

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/somity_db';

  try {
    mongoose.connection.on('connected', () => {
      console.log('✅ [MongoDB] Connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB] Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  [MongoDB] Connection lost / disconnected');
    });

    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    return conn;
  } catch (error) {
    console.error('❌ [MongoDB] Initial connection failed:', error);
    // In dev mode, don't crash immediately so API server can still respond to health checks
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return mongoose;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};

