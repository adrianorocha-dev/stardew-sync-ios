import { z } from "zod";

export const SaveDataValidator = z.object({
  Farmer: z.object({
    name: z.string(),
    UniqueMultiplayerID: z.string(),
    farmName: z.string(),
    money: z.number(),
    saveTime: z.number(),
  }),
});
