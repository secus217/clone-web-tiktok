import {BaseEntity} from "../BaseEntity"
import {Entity, Property, ManyToOne, OneToMany, Collection,type Opt} from '@mikro-orm/core';
import {User, Like, Comment} from "../index";

@Entity()
export default class Video extends BaseEntity {
    @ManyToOne(() => User)
    user!: User;

    @Property()
    title!: string;

    @Property({nullable: true, default: ''})
    hashtags?: string = '';

    @Property()
    videoUrl!: string;

    @Property({nullable: true})
    thumbnailUrl?: string;

    @Property({default: 0})
    views: Opt & number = 0;

    @Property({default: 0})
    likesCount: Opt & number = 0;

    @Property({default: 0})
    commentsCount: Opt & number = 0;

    @Property({default: 0})
    sharesCount: Opt & number = 0;

    @Property()
    duration: Opt & number = 0;

    @Property({nullable: true})
    music?: string;

    @OneToMany(() => Comment, comment => comment.video)
    comments = new Collection<Comment>(this);

    @OneToMany(() => Like, like => like.video)
    likes = new Collection<Like>(this);
}