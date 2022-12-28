import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
        constructor (
                @Inject(CACHE_MANAGER) private readonly cache: Cache,
        ) { }

        async setCache(key: string, value: string): Promise<void> {
                await this.cache.set(key, value);
        }

        async deleteCache(key: string): Promise<void> {
                await this.cache.del(key);
        }

        async resetCache(): Promise<void> {
                await this.cache.reset();
        }

        async getCache(key: string): Promise<{
                key: string, value: string, ttl: number
        }> {
                const value = await this.cache.get(key) as string;
                const ttl = await this.cache.store.ttl(key)
                return {
                        key, value, ttl
                };
        }

        async getAllData() {
                //Get all keys
                const keys = await this.cache.store.keys();

                //Loop through keys and get data
                let allData: { [key: string]: any } = {};
                for (const key of keys) {
                        allData[key] = await this.cache.get(key);
                }
                return allData;
        }
}
