"use client";
import MuxPlayer from "@mux/mux-player-react";

type ActivityVideoPlayerProps = {
  playbackId?: string | null;

}

export const ActivityVideoPlayer = ({
  playbackId,
}: ActivityVideoPlayerProps) => {
  return (
    <div className="relative p-6 aspect-video w-full">
       <MuxPlayer
          autoPlay
          playbackId={playbackId ?? undefined}
        />
    </div>
  )
}