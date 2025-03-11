import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import {User,Video} from "../index";
@Entity()
export default class Comment {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Video)
    video!: Video;

    @Property()
    content!: string;

    @Property({ default: 0 })
    likesCount: number = 0;

    @ManyToOne(() => Comment, { nullable: true })
    parentComment?: Comment;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}