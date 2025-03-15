import {BaseEntity} from "../BaseEntity";
import {Entity, Property, PrimaryKey, ManyToOne} from "@mikro-orm/core";
import User from "../User"

@Entity()
export default class Follow extends BaseEntity {
    constructor() {
        super();
    }
    @Property()
    followerId!: bigint;
    @Property()
    followeeId!: bigint;
}