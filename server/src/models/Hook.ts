import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { SampleLetter } from "./SampleLetter";

@ObjectType()
@Entity()
export class Hook extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    value!: string;

    @Field(() => [SampleLetter])
    @ManyToMany(() => SampleLetter, sampleLetter => sampleLetter.hooks, {
        lazy: true,
        cascade: true,
    })
    @JoinTable({ name: "hook_sample_letter" })
    sampleLetters?: Array<SampleLetter>

    public set newSampleLetter(sampleLetter: SampleLetter) {
        this.sampleLetters.push(sampleLetter);
    }
}

@InputType()
export class HookInput {
    @Field()
    @Column()
    value!: string;
}

@InputType()
export class HookUpdateInput {
    @Field({ nullable: true })
    @Column()
    value!: string;
}

@InputType()
export class MarkerInput { 
    @Field()
    value: string; 

    @Field()
    input: string; 
}