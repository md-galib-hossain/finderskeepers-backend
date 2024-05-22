import {  Status } from "@prisma/client";

export type TClaim = {
  foundItemId: string;
  distinguishingFeatures: string;
  lostDate: string;
  status?: Status;
  userId: string;
};
