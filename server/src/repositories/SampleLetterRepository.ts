import { EntityRepository, Repository } from "typeorm";
import { getConnection, InsertResult } from "typeorm";
import { SampleLetter } from "../models/SampleLetter";
import { InsertHookSampleLetterQuery } from "../types/InsertHookSampleLetterQuery";

@EntityRepository(SampleLetter)
export class SampleLetterRepository extends Repository<SampleLetter> {

    insertIntoHookSampleLetterTable:InsertHookSampleLetterQuery = async (sampleLetterId: number, hookId: number): Promise<InsertResult | void> => {
        return getConnection()
            .createQueryBuilder()
            .insert()
            .into("hook_sample_letter")
            .values([{ sampleLetterId: sampleLetterId, hookId: hookId }])
            .execute()
            .catch((err) => console.log(err));

    }
}