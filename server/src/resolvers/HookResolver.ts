import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { decodeHTMLSpecialChar } from "../helpers/htmlSpecialChar";

import { Hook, HookInput, HookUpdateInput } from "../models/Hook";

@Resolver()
export class HookResolver {
    private hookRepository = getRepository(Hook);

    @Query(() => [Hook])
    async getHooks(): Promise<Hook[]> {
        return await this.hookRepository.find();
    }

    @Query(() => Hook)
    async getHook(@Arg("id", () => ID) id: number): Promise<Hook> {
        return await this.hookRepository.findOne(id);
    }

    @Mutation(() => Hook)
    async createHook(@Arg("data") newHookData: HookInput): Promise<Hook> {
        const dbHook = await this.hookRepository.findOne({ 'where': { 'value': newHookData.value } })

        return !dbHook ? await this.hookRepository.create(newHookData).save() : dbHook;
    }

    @Mutation(() => Hook!, { nullable: true })
    async updateHook(
        @Arg("data", () => HookUpdateInput) updateHook: Hook,
        @Arg("id", () => ID) id: number,
    ): Promise<Hook | null> {
        const hook = await this.hookRepository.findOne(id);

        return hook ?
            await this.hookRepository.update(id, updateHook) &&
            hook.reload() &&
            hook
            : null;
    }

    @Mutation(() => Hook!, { nullable: true })
    async removeHook(
        @Arg("id", () => ID) id: number,
    ): Promise<Hook | null | undefined> {
        const hook = await this.hookRepository.findOne(id);

        return hook ?
            await this.hookRepository.delete(id) &&
            hook
            : null;
    }
}