import { useEffect, useRef } from "react";
import { fullpath } from "@brushes/component-tool";

interface VideoProps {
  src: string;
  style: React.CSSProperties;
  actived: boolean;
}

export const Video = ({ src, style, actived }: VideoProps) => {
  const videoRefs = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 处理视频播放/暂停
    if (actived && videoRefs.current) {
      videoRefs.current.play().catch((error: any) => {
        console.log("自动播放被阻止:", error);
        // 可以在这里添加用户交互后播放的逻辑
        videoRefs.current!.controls = true;
      });
    } else if (videoRefs.current) {
      videoRefs.current.pause();
      videoRefs.current.currentTime = 0;
      videoRefs.current.controls = false;
    }
  }, [actived]);

  return (
    <video
      ref={videoRefs}
      muted
      loop
      preload="auto"
      controls
      style={style}
      src={fullpath(src)}
    ></video>
  );
};
