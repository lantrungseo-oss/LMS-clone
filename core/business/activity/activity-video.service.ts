import * as activityBusinessType from './types';
import { myMux } from '@/lib/mux';

export class ActivityVideoService implements activityBusinessType.IActivityVideoService {
  constructor(
    private readonly muxDataRepo: activityBusinessType.IMuxDataRepo,
  ){}
  async getVideoDataForActivity(activityId: string): Promise<activityBusinessType.IActivityVideoResult | null> {
    const muxData = await this.muxDataRepo.getActivityMuxData(activityId);
    if(muxData) {
      return {
        playbackId: muxData.playbackId
      }
    }
    return null;
  }

  async updateActivityVideo(activityId: string, videoUrl: string) {
    const muxData = await this.muxDataRepo.getActivityMuxData(activityId);
    if(muxData) {
      // await myMux.Video.Assets.del(muxData.assetId);
      await this.muxDataRepo.deleteActivityMuxData(activityId);
    }
    const asset = await myMux.Video.Assets.create({
      input: videoUrl,
      playback_policy: "public",
      test: false,
    });

    const muxRecord = await this.muxDataRepo.createMuxData({
      playbackId: asset.playback_ids?.[0]?.id ?? null,
      assetId: asset.id,
      activityId,
    })

    return {
      playbackId: muxRecord.playbackId ?? undefined,
    }
  }

  async deleteActivityVideo(activityId: string): Promise<void> {
    const muxData = await this.muxDataRepo.getActivityMuxData(activityId);
    if(muxData) {
      await myMux.Video.Assets.del(muxData.assetId);
      await this.muxDataRepo.deleteActivityMuxData(activityId);
    }
  }
}