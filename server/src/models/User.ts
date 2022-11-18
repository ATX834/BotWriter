import { IsEmail } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SampleLetter } from "./SampleLetter";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Field()
  @Column()
  firstname!: string;

  @Field()
  @Column()
  lastname!: string;

  @Field()
  @Column()
  password!: string;

  @Field()
  @Column("bool", { default: false })
  confirmed!: boolean;

  @Field(() => [SampleLetter], { nullable: true })
  @OneToMany(
    () => SampleLetter,
    (sampleLetter) => sampleLetter.user,
    {
      eager: true,
      cascade: true,
      // onDelete: "CASCADE",
      // onUpdate: "CASCADE",
    },
  )
  sampleLetters?: SampleLetter[];
}

@InputType()
export class UserInput extends BaseEntity {
  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  firstname!: string;

  @Field()
  @Column()
  lastname!: string;

  @Field()
  @Column()
  password!: string;
}
@InputType()
export class UserUpdateInput extends BaseEntity {
  @Field({ nullable: true })
  @Column()
  email!: string;

  @Field({ nullable: true })
  @Column()
  firstname!: string;

  @Field({ nullable: true })
  @Column()
  lastname!: string;
}
@InputType()
export class ResetPasswordInput extends BaseEntity {
  @Field({ nullable: true })
  @Column()
  password!: string;
}
