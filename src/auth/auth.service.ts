import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthService extends CacheService {}
