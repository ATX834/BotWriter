import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User";
import { Hook } from "./Hook";

@ObjectType()
@Entity()
export class SampleLetter extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column("longtext")
    content!: string;

    @Field(() => User)
    @ManyToOne(() => User, user => user.sampleLetters, { lazy: true, onDelete: "CASCADE" },)
    user!: User;

    @Field(() => [Hook])
    @ManyToMany(() => Hook, hook => hook.sampleLetters, { lazy: true, onDelete: "CASCADE" })
    hooks?: Array<Hook>;

    public set newHook(hook: Hook) {
        this.hooks.push(hook);
    }
}


@InputType()
export class SampleLetterInput {
    @Field()
    @Column()
    title!: string;

    @Field(() => User)
    @ManyToOne(() => User, user => user.sampleLetters, { lazy: true })
    user!: User;

    @Field()
    @Column("longtext")
    content!: string;
}

@InputType()
export class SampleLetterUpdateInput {
    @Field({ nullable: true })
    @Column()
    title!: string;

    @Field({ nullable: true })
    @Column("longtext")
    content!: string;
}