import express, { Express, NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { OAuthConfig } from './types';
import { AppDataSource } from './database/data-source';
import { User } from './database/entities/User';
import jwt from 'jsonwebtoken';

async function saveUser(userData: Partial<User>) {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create(userData);
    return userRepository.save(user);
}

async function findUserByProviderId(providerId: string) {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({ where: { providerId } });
}

const JWT_SECRET = process.env.JWT_SECRET || ''

export function initOAuth(app: Express, config: OAuthConfig) {
    // Маршрут для обработки токена
    app.post('/auth/oauth/token', async (req: Request, res: Response): Promise<void> => {
        if (!req.body.code) {
            res.status(400).json({ error: 'Authorization code is required' });
        }

        try {
            const response = await axios.post(config.tokenUrl, {
                client_id: config.clientId,
                client_secret: config.clientSecret,
                grant_type: 'authorization_code',
                redirect_uri: config.callbackUrl,
                code: req.body.code,
            });

            const userInfo = await axios.get(config.userInfoUrl, {
                headers: { Authorization: `Bearer ${response.data.access_token}` },
            });

            const userData = {
                provider: config.provider,
                providerId: userInfo.data.id,
                name: userInfo.data.name,
                email: userInfo.data.email,
                avatar: userInfo.data.picture,
            };

            let user = await findUserByProviderId(userData.providerId);
            if (!user) {
                user = await saveUser(userData);
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'User authenticated', user, token });
        } catch (error: any) {
            console.error('OAuth Authentication Error:', error.response?.data || error.message);
            res.status(500).json({
                error: 'Failed to authenticate user',
                details: error.response?.data || error.message,
            });
        }
    });

    // Маршрут для обработки Google callback (или других OAuth провайдеров)
    app.get('/google/callback', async (req: Request, res: Response): Promise<void> => {
        try {
            const { code } = req.query;
            if (!code) {
                res.status(400).json({ error: 'Authorization code is required' });
            }

            // Отправка кода на endpoint для получения токена
            const response = await axios.post(config.tokenUrl, {
                client_id: config.clientId,
                client_secret: config.clientSecret,
                grant_type: 'authorization_code',
                redirect_uri: config.callbackUrl,
                code: code,
            });

            // Получение информации о пользователе с использованием access_token
            const userInfo = await axios.get(config.userInfoUrl, {
                headers: { Authorization: `Bearer ${response.data.access_token}` },
            });

            const userData = {
                provider: config.provider,
                providerId: userInfo.data.id,
                name: userInfo.data.name,
                email: userInfo.data.email,
                avatar: userInfo.data.picture,
            };

            // Проверка, существует ли уже пользователь
            let user = await findUserByProviderId(userData.providerId);
            if (!user) {
                user = await saveUser(userData);
            }

            // Создание JWT токена
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

            // Возврат информации о пользователе и токена
            res.status(200).json({ message: 'User authenticated', user, token });
        } catch (error: any) {
            console.error('Google OAuth Callback Error:', error.response?.data || error.message);
            res.status(500).json({
                error: 'Failed to authenticate user with Google',
                details: error.response?.data || error.message,
            });
        }
    });
}


export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded; // Привязываем данные пользователя к запросу
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

