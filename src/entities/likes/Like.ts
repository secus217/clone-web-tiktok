import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import {User,Video} from "../index";
import {BaseEntity} from "../BaseEntity";
@Entity()
export default class Like extends BaseEntity{
    @ManyToOne(() => User)
    user!: User;
    @ManyToOne(() => Video)
    video!: Video;

}