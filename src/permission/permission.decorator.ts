import { SetMetadata } from "@nestjs/common";

export const HasPermission = () => SetMetadata("access", "access")