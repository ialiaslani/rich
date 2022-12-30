import { SetMetadata } from "@nestjs/common";

export const HasPermission = (type: "public" | "private") => SetMetadata("access", type === "public")