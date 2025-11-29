import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import assetRoutes from './routes/assets';
import licenseRoutes from './routes/licenses';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/licenses', licenseRoutes);

app.get('/', (req, res) => {
    res.send('Mint2Story Backend is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
