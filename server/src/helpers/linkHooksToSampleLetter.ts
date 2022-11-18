import { getRepository } from "typeorm";
import { Hook, HookInput } from "../models/Hook";
import { InsertHookSampleLetterQuery } from "../types/InsertHookSampleLetterQuery";

export default function linkHooksToSampleLetter(hooks: HookInput[], sampleLetterId: number, insertIntoHookSampleLetterTable: InsertHookSampleLetterQuery) {

    const hookRepository = getRepository(Hook)

    hooks.forEach(async (hook: Hook) => {
        
        let dbHook = await hookRepository.findOne({ 'where': { 'value': hook.value } })

        if (!dbHook) {

            dbHook = await hookRepository.create(hook).save()

        }
        await insertIntoHookSampleLetterTable(sampleLetterId, dbHook.id);
    })
}