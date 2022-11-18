import {
  Query,
  Resolver,
  Mutation,
  Arg,
  ID,
  Authorized,
  Ctx,
} from "type-graphql";
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResetPasswordInput, User, UserUpdateInput } from "../models/User";
import { createTokenUrl } from "../helpers/createTokenUrl";
import { MailType } from "../types/EmailType";
import sendMail from "../helpers/sendMail";

@Resolver()
export class UserResolver {
  private jwtKeyLogin = process.env.JWT_LOGIN;
  // private jwtKeyRefresh = process.env.JWT_REFRESH;
  private userRepository = getRepository(User);

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @Query(() => User)
  async getUser(@Arg("id", () => ID) id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  @Mutation(() => User)
  async signup(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string
  ): Promise<User | Error> {
    try {
      if (await this.userRepository.findOne({ email })) {
        throw new Error("User already exists");
      }
      password = await bcrypt.hash(password, bcrypt.genSaltSync(14));

      const validateUrl = await createTokenUrl(email, "/user/confirm");
      const mail: MailType = {
        from: "noreply@genLDM.com",
        to: email,
        subject: "Account confirmation genLDM",
        text: "Please visit the following url to confirm your new account",
        html: `<p>Please visit the following url to confirm your new account</p><a href="${validateUrl}">${validateUrl}</a>`, // html body
      };

      sendMail(mail);

      const newUser = { email, password, firstname, lastname };
      const user = this.userRepository.create(newUser);
      await user.save();

      return user;
    } catch (e) {
      console.log(e);
    }
  }

  @Mutation(() => User!, { nullable: true })
  async updateUser(
    @Arg("data", () => UserUpdateInput) updateUser: User,
    @Arg("id", () => ID) id: number
  ): Promise<User | null> {
    const user = await this.userRepository.findOne(id);

    return user
      ? (await this.userRepository.update(id, updateUser)) &&
          user.reload() &&
          user
      : null;
  }

  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_MAIL_TOKEN);
      await User.update({ email: decoded.email }, { confirmed: true });
      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation(() => User!, { nullable: true })
  async removeUser(
    @Arg("id", () => ID) id: number
  ): Promise<User | null | undefined> {
    const user = await this.userRepository.findOne(id);

    return user ? (await this.userRepository.delete(id)) && user : null;
  }

  @Mutation(() => Boolean)
  async resetUserPassword(
    @Arg("reset", () => ResetPasswordInput) reset: ResetPasswordInput,
    @Arg("token") token: string
  ): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_MAIL_TOKEN);
      if (decoded) {
        let newPassword = await bcrypt.hash(
          reset.password,
          bcrypt.genSaltSync(14)
        );
        await User.update({ email: decoded.email }, { password: newPassword });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    let user = await this.userRepository.findOne({ email });

    if (user) {
      const validateUrl = await createTokenUrl(email, "/user/reset");
      const mail: MailType = {
        from: "noreply@genLDM.com",
        to: email,
        subject: "Reset password",
        text: "Reset password",
        html: `
              <h3>If you haven't request a password reset please ignore this mail</h3>
              <p>This mail was sent to you because you request a new password</p>
              <p>Visit the following url to reset your password</p>
              <a href="${validateUrl}">${validateUrl}</a>`,
      };
      sendMail(mail);
      return true;
    }
    return false;
  }

  @Mutation(() => String, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string | null | Error> {
    try{
      let user = await this.userRepository.findOne({ email });
      if (user) {
        if (!user.confirmed) {
          throw new Error("You have to confirm your account");
        }
        if (await bcrypt.compare(password, user.password)) {
          const accessToken = jwt.sign(
            {
              email: user.email,
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
            },
            this.jwtKeyLogin,
            { expiresIn: "7 days" }
          );

          return accessToken;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch(e) {
      console.log(e)
    }
  }

  @Mutation(() => Boolean)
  async resendMailConfirmation(@Arg("email") email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });

    if (user && !user.confirmed) {
      const validateUrl = await createTokenUrl(email, "/user/confirm");
      const mail: MailType = {
        from: "noreply@genLDM.com",
        to: email,
        subject: "Account confirmation genLDM",
        text: "Please visit the following url to confirm your new account",
        html: `<p>Please visit the following url to confirm your new account</p><a href="${validateUrl}">${validateUrl}</a>`, // html body
      };

      await sendMail(mail);
      return true;
    }

    return false;
  }

  @Authorized()
  @Query(() => User)
  async getProfile(@Ctx() context: { user: User }): Promise<User | null> {
    const user = context.user;
    return await this.userRepository.findOne(user.id);
  }
}
