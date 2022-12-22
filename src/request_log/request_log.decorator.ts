import { SetMetadata } from "@nestjs/common";

export const LogRequest = (name: string) => SetMetadata("name", name)