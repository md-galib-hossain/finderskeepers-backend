import { Status } from "@prisma/client";

export type TClaim = {
  foundItemId: string;
  lostItemId: string;
  contactNo: string;
  description: string;
  distinguishingFeatures: string;
  lostDate: string;
  status?: Status;
  userId: string;
  isDeleted: boolean;
  itemImg: string;
};
