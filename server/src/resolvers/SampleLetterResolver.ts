import {
  Query,
  Resolver,
  Mutation,
  Arg,
  ID,
  Ctx,
  Authorized,
} from "type-graphql";
import { getCustomRepository } from "typeorm";
import { v4 as uuidv4 } from "uuid"
import {
  SampleLetter,
  SampleLetterInput,
  SampleLetterUpdateInput,
} from "../models/SampleLetter";
import { HookInput, MarkerInput } from "../models/Hook";
import { User } from "../models/User";
import { SampleLetterRepository } from "../repositories/SampleLetterRepository";
import linkHooksToSampleLetter from "../helpers/linkHooksToSampleLetter";
import { decodeHTMLSpecialChar } from "../helpers/htmlSpecialChar";
import generateFinalHtml from "../helpers/generateFinalHTML";
import axios from "axios";
import fs from "fs"

const PDF_API_URL = "http://pdf_api:8000"

@Resolver()
export class SampleLetterResolver {
  private sampleLetterRepository = getCustomRepository(SampleLetterRepository);
  private customInsertQuery =
    this.sampleLetterRepository.insertIntoHookSampleLetterTable;

  @Authorized()
  @Query(() => [SampleLetter])
  async getSampleLettersByUser(
    @Ctx() context: { user: User }
  ): Promise<SampleLetter[]> {
    return await this.sampleLetterRepository.find({
      where: [{ user: context.user }],
    });
  }

  @Authorized()
  @Query(() => [SampleLetter])
  async getSampleLettersBySearchTerm(
    @Ctx() context: { user: User },
    @Arg("search", () => String) search: string
  ): Promise<SampleLetter[]> {
    return await this.sampleLetterRepository
      .createQueryBuilder()
      .select()
      .where("LOWER(title) LIKE LOWER(:search)", { search: `%${search}%` })
      .andWhere("userId = :userId", { userId: context.user.id })
      .getMany();
  }

  @Authorized()
  @Query(() => SampleLetter, { nullable: true })
  async getSampleLetterByUser(
    @Arg("id", () => ID) id: number,
    @Ctx() context: { user: User }
  ): Promise<SampleLetter | boolean> {
    const dbSampleLetter = await this.sampleLetterRepository.findOne(id, {
      where: {
        user: context.user,
      },
    });

    return dbSampleLetter ? dbSampleLetter : false;
  }

  @Authorized()
  @Mutation(() => SampleLetter)
  async createSampleLetter(
    @Arg("content", () => String) content: any,
    @Arg("title", () => String) title: string,
    @Ctx() context: { user: User }
  ): Promise<SampleLetter | User | null> {

    content = JSON.parse(content).child;

    const hooks: HookInput[] = [];

    for (const element of content) {
      if (element.child) {
        for (let i = 0; i < element.child.length; i++) {
          if (element.child[i].tag === "input") {
            const value = decodeHTMLSpecialChar(element.child[i].attr.value)
            element.child[i].attr.value = value;
            hooks.push({ value });
          }
        }
      }
    }

    content = JSON.stringify({ node: "root", child: content });

    const sampleLetter: SampleLetterInput = {
      title,
      content: "" + content + "",
      user: context.user,
    };


    const newSampleLetter = await this.sampleLetterRepository
      .create(sampleLetter)
      .save();

    this.sampleLetterRepository.create();

    linkHooksToSampleLetter(
      hooks,
      newSampleLetter.id,
      this.customInsertQuery
    );

    return newSampleLetter;
  }

  @Mutation(() => SampleLetter, { nullable: true })
  async updateSampleLetter(
    @Arg("sampleLetter", () => SampleLetterUpdateInput)
    updateSampleLetter: SampleLetter,
    @Arg("sampleLetterId", () => ID) id: number
  ): Promise<SampleLetter | void> {
    const sampleLetter = await this.sampleLetterRepository.findOne(id);

    if (!sampleLetter) return null;

    const hooks: HookInput[] = [];

    let content = JSON.parse(sampleLetter.content)

    for (const element of content) {
      if (element.child) {
        for (let i = 0; i < content.child.length; i++) {
          if (content.child[i].tag === "input") {
            const value = decodeHTMLSpecialChar(content.child[i].attr.value)
            content.child[i].attr.value = value;
            hooks.push({ value });
          }
        }
      }
    }

    updateSampleLetter.content = JSON.stringify({ node: "root", child: content })

    await this.sampleLetterRepository.update(id, updateSampleLetter);
    sampleLetter.reload();

    linkHooksToSampleLetter(hooks, sampleLetter.id, this.customInsertQuery);

    return sampleLetter;
  }

  @Mutation(() => SampleLetter!, { nullable: true })
  async removeSampleLetter(
    @Arg("id", () => ID) id: number
  ): Promise<SampleLetter | void> {
    const sampleLetter = await this.sampleLetterRepository.findOne(id);

    return sampleLetter
      ? this.sampleLetterRepository.delete(id) && sampleLetter
      : null;
  }

  @Authorized()
  @Mutation((
  ) => String, { nullable: true })
  async generatePdf(
    @Arg("id", () => ID) id: number,
    @Arg("markers", () => [MarkerInput]) markers: MarkerInput[],
    @Ctx() context: { user: User }
  ): Promise<boolean | string | Object> {
    try {
      const dbSampleLetter = await this.sampleLetterRepository.findOne(id, {
        where: {
          user: context.user,
        },
      });


      const filename = `${uuidv4()}.pdf`

      const finalHtml = generateFinalHtml(dbSampleLetter.content, markers)

      const response = await axios.post(`${PDF_API_URL}/generate-pdf`, { finalHtml }, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'application/pdf'
        }
      })

      fs.writeFileSync(process.env.FILES_PATH + filename, response.data)

      return response ? filename : false

    } catch (e) {
      console.log(e)
    }
  }

  @Authorized()
  @Mutation(() => String, { nullable: true })
  async previewHtml(
    @Arg("id", () => ID) id: number,
    @Arg("markers", () => [MarkerInput]) markers: MarkerInput[],
    @Ctx() context: { user: User }
  ): Promise<boolean | string> {

    const dbSampleLetter = await this.sampleLetterRepository.findOne(id, {
      where: {
        user: context.user,
      },
    });

    return dbSampleLetter ? generateFinalHtml(dbSampleLetter.content, markers) : false
  }
}
