import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { EntityManager } from '@mikro-orm/core';
import {User} from '../entities/index';

interface AppStore {
    em: EntityManager;
}
declare module 'elysia' {
    interface ElysiaContext {
        user: User | null;
    }
}
export const authMiddleware = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'secretfjsdlkfjasdkldsakljsdkldsfa',
        })
    )
    .derive(async ({ jwt, headers, set, store }) => {
        const em = (store as AppStore).em;

        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { user: null };
        }

        const token = authHeader.split(' ')[1];

        const payload = await jwt.verify(token);
        if (!payload || !payload.userId) {
            return { user: null };
        }

        const user = await em.findOne(User, { id: payload.userId });

        return { user };
    });


export const isAuthenticated = new Elysia()
    .use(authMiddleware)
    .guard({
        beforeHandle: ({ user, set }) => {
            if (!user) {
                set.status = 401;
                return {
                    success: false,
                    message: 'Unauthorized: Bạn cần đăng nhập để truy cập tài nguyên này'
                };
            }
        }
    });


export const isAdmin = new Elysia()
    .use(authMiddleware)
    .guard({
        beforeHandle: ({ user, set }) => {
            if (!user) {
                set.status = 401;
                return {
                    success: false,
                    message: 'Unauthorized: Bạn cần đăng nhập để truy cập tài nguyên này'
                };
            }

            if (user.role !== 'admin') {
                set.status = 403;
                return {
                    success: false,
                    message: 'Forbidden: Bạn không có quyền truy cập tài nguyên này'
                };
            }
        }
    });