import {initORM} from "../db";
import {Elysia} from "elysia";
import User from "../entities/User"

export class FollowService {
    async followUser(followerId: bigint, followeeId: bigint) {
        const db = await initORM();
        const existFollow = await db.follow.findOne({
            followerId: followerId,
            followeeId: followeeId
        });
        if (existFollow) {
            return existFollow;
        }
        const [follower, followee] = await Promise.all([
            db.em.findOne(User,{id: followerId}),
            db.em.findOne(User,{id: followeeId}),
        ]);
        if (!follower || !followee) {
            throw new Error("User not found");
        }
        const follow = db.follow.create({
            followerId: followerId,
            followeeId: followeeId
        });
        await db.em.persistAndFlush(follow)
        return follow;
    }

    async unfollowUser(followerId: bigint, followeeId: bigint) {
        const db = await initORM();
        const follow = await db.follow.findOne({
            followerId: followerId,
            followeeId: followeeId
        });
        if (follow) {
            await db.em.remove(follow);
            await db.em.flush();
        }
        return {
            messaage: "Unfollow successfully"
        }

    }

    async getFollowing(userId: bigint, limit:number=20, offset:number= 0) {
        const db = await initORM();
        const follows = await db.follow.find({followerId: userId}, {
            limit,
            offset
        });
        if (follows.length === 0) {
            return [];
        }
        const followeeIds = follows.map(follow => follow.followeeId);
        return db.em.find(User, {id: {$in: followeeIds}});
    }

    async getFollower(userId: bigint, limit: 20, offset: 0) {
        const db = await initORM();
        const follows = await db.follow.find({followeeId: userId}, {
            limit,
            offset
        });
        if (follows.length === 0) {
            return [];
        }
        const followerIds = follows.map(follow => follow.followerId);
        return db.em.find(User, {id: {$in: followerIds}});
    }

    async followerCount(userId: bigint) {
        const db = await initORM();
        return db.follow.count({followeeId: userId});
    }

    async followeeCount(userId: bigint) {
        const db = await initORM();
        return db.follow.count({followerId: userId});
    }

    async isFollowing(followerId: bigint, followeeId: bigint) {
        const db = await initORM();
        const count = await db.follow.count({
            followerId: followerId,
            followeeId: followeeId
        });
        return count > 0;
    }
}
export default new Elysia().decorate('followService', new FollowService())