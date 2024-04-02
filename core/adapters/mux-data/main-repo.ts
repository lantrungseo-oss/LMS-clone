import { db } from "@/lib/db";
import { MuxData } from "@prisma/client";

interface ICreateMuxDataInput extends Omit<MuxData, 'id'> {}

export class MainMuxDataRepo {
  async getActivityMuxData(activityId: string) {
    const muxData = await db.muxData.findMany({
      where: { activityId }
    })

    if(muxData.length === 0) {
      return null;
    }
    return muxData[0];
  }
  async deleteActivityMuxData(activityId: string) {
    await db.muxData.deleteMany({
      where: { activityId }
    })
  }
  async createMuxData(dat: ICreateMuxDataInput) {
    return await db.muxData.create({
      data: dat
    })
  }
}