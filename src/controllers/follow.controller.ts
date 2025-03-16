import {Elysia, t} from "elysia";
import followService from "../services/FollowService";
import isAuthenticated from "../middlewares/isAuthenticated";

const followController = new Elysia()
    .group("/follow", group =>
        group
            .use(followService)
            .derive(isAuthenticated())
            .post("/follow-user", async ({body, followService,user}) => {
                const followeeId = BigInt(body.followeeId);
                return await followService.followUser(user.id, followeeId);
            }, {
                detail: {
                    tags: ["Follow"],
                    security: [{ JwtAuth: [] }]
                },
                body: t.Object({
                    followeeId: t.String(),
                })
            })
            .post("/unfollow-user", async ({body, followService,user}) => {
                const followeeId = BigInt(body.followeeId);
                return await followService.unfollowUser(user.id, followeeId);
            }, {
                detail: {
                    tags: ["Follow"],
                    security: [{ JwtAuth: [] }]
                },
                body: t.Object({
                    followeeId: t.String(),
                })
            })
            .get("/following/:userId", async ({ params, query, followService }) => {
                const userId = BigInt(params.userId);
                const limit = query.limit ? parseInt(query.limit) : 20;
                const offset = query.offset ? parseInt(query.offset) : 0;
                return await followService.getFollowing(userId, limit, offset);
            }, {
                detail: {
                    tags: ["Follow"],
                    summary: "Get following",
                    description: "Get all users that the specified user is following",
                },
                params: t.Object({
                    userId: t.String({
                        description: "User ID (as string, will be converted to BigInt)"
                    })
                }),
                query: t.Object({
                    limit: t.Optional(t.String({
                        description: "Number of results to return (default: 20)"
                    })),
                    offset: t.Optional(t.String({
                        description: "Number of results to skip (default: 0)"
                    }))
                })
            })
    )
export default followController