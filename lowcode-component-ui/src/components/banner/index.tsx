import React, { useState } from "react";
import { Carousel, Image } from "antd";
import { fullpath, useNavigateImpl } from "@brushes/component-tool";
import { Video } from "../../common";

interface BannerProps {
  menu: Array<{
    imgUrl: string;
    link: string;
    borderRadius: number;
    width: number;
    height: number;
  }>;
  borderRadius?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

export const Banner: React.FC<BannerProps> = ({
  menu,
  borderRadius,
  width,
  height,
  ...restProps
}) => {
  const { navigator } = useNavigateImpl();
  const [ind, setIndex] = useState(0);
  const handleSlideChange = (currentIndex: number) => {
    setIndex(currentIndex);
  };
  return (
    <Carousel afterChange={handleSlideChange} autoplay={true} {...restProps}>
      {menu.map((item, index) => (
        <h3 key={index}>
          {item.imgUrl.includes(".mp4") ||
          item.imgUrl.includes(".webm") ||
          item.imgUrl.includes(".avi") ? (
            <Video
              actived={index === ind}
              style={{ borderRadius, width, height, overflow: "hidden" }}
              src={item.imgUrl}
            />
          ) : (
            <Image
              onClick={(e) => {
                navigator(item.link);
                e.stopPropagation();
              }}
              preview={false}
              style={{ borderRadius, width, height, overflow: "hidden" }}
              src={fullpath(item.imgUrl)}
            />
          )}
        </h3>
      ))}
    </Carousel>
  );
};
