import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
            },
        });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
            expiresIn: '24h',
        });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
            expiresIn: '24h',
        });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Me
router.get('/me', authenticateToken, async (req: any, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.sendStatus(404);
        res.json({ id: user.id, email: user.email });
    } catch (error) {
        res.sendStatus(500);
    }
});

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google token' });
        }

        const email = payload.email;

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create new user with random password (since they use Google)
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                },
            });
        }

        const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
            expiresIn: '24h',
        });

        res.json({ token: jwtToken, user: { id: user.id, email: user.email } });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(400).json({ error: 'Google authentication failed' });
    }
});

export default router;
