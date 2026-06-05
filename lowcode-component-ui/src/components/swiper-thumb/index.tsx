import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { createStyles } from "antd-style";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useModuleContext } from "@brushes/component-core";
import { get, isEmpty } from "lodash";
import { fullpath } from "@brushes/component-tool";
import { Video } from "../../common";

const useStyles = createStyles(
  (
    { css, token },
    { bottom, borderRadius }: { bottom: number; borderRadius: number },
  ) => {
    return {
      container: css`
        position: relative;
        margin-bottom: 10px;
        .mySwiper2 {
          width: 100%;
          img {
            border-radius: ${borderRadius}px;
          }
        }

        .mySwiper {
          //height: 60px;
          position: absolute;
          bottom: 0;
          left: 30px;
          padding: 0;
          width: calc(100% - 60px);
          box-sizing: border-box;
        }

        .mySwiper .swiper-slide {
          width: 25%;
          height: 100%;
          opacity: 0.4;
        }

        .mySwiper .swiper-slide-thumb-active {
          opacity: 1;
        }

        .swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: ${borderRadius}px;
          object-fit: cover;
        }

        .swiper-button-prev,
        .swiper-button-next {
          bottom: ${bottom}px;
          top: auto;
          transform: scale(0.55);
          color: ${token.colorPrimary};
        }

        .swiper-button-prev {
          left: 0;
        }
        .swiper-button-next {
          right: 0;
        }
      `,
    };
  },
);

function changeData(data: any[], imgKey: string) {
  let img = "";
  let res = [];
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i];
    if (typeof item === "string") {
      res.push(item);
      continue;
    }
    if (item.goodsFileSort === "videocover") {
      img = item.goodsFileUrl;
    } else {
      item.smallUrl = item[imgKey];
      res.push(item);
    }
  }
  return res.map((item) => {
    if (item.goodsFileSort === "goodsvideo") {
      item.smallUrl = img;
    }
    return item;
  });
}

export function SwiperThumb({
  height,
  borderRadius,
  gapHeight,
  bottom,
  minHeight,
  splitStr = "",
  imgKey = "goodsFileUrl",
  dataPath = "rsGoodsFileDomainList",
  storeKey = "_skuInfo",
}: {
  borderRadius: number;
  bottom: number;
  gapHeight: number;
  minHeight: number;
  splitStr?: string;
  imgKey?: string;
  dataPath?: string;
  storeKey: string;
  height: number;
}) {
  const defaultValue = useModuleContext((s) => s.moduleStore.defaultValue);
  const _skuInfo = useModuleContext((s) => s.moduleStore[storeKey]);

  const banner = useMemo(() => {
    if (splitStr && !isEmpty(_skuInfo)) {
      return (
        changeData(get(_skuInfo, dataPath, "").split(splitStr), imgKey) || []
      );
    }
    // 优先取sku模块的数据 > 页面模块的数据
    if (_skuInfo && !isEmpty(_skuInfo)) {
      return changeData(get(_skuInfo, dataPath, []), imgKey);
    }
    return changeData(get(defaultValue, dataPath, []), imgKey);
  }, [defaultValue, _skuInfo]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [ind, setIndex] = useState(0);
  const handleSlideChange = (swiper: object) => {
    setIndex(swiper.activeIndex);
  };
  const { styles } = useStyles({ bottom, borderRadius });

  return (
    <div
      className={styles.container}
      style={{ height: height + gapHeight + minHeight }}
    >
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        onSlideChange={handleSlideChange}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className={"mySwiper2"}
        style={{ height, paddingBottom: gapHeight + minHeight }}
      >
        {banner.map((item, index) => (
          <SwiperSlide key={index}>
            {(imgKey ? item[imgKey] : item).includes(".mp4") ||
            (imgKey ? item[imgKey] : item).includes(".webm") ||
            (imgKey ? item[imgKey] : item).includes(".avi") ? (
              <Video
                actived={index === ind}
                style={{ height, overflow: "hidden" }}
                src={item[imgKey]}
              />
            ) : (
              <img src={fullpath(imgKey ? item[imgKey] : item)} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        style={{ height: minHeight }}
        className={"mySwiper"}
      >
        {banner.map((item: any, index: number) => (
          <SwiperSlide key={index}>
            <img src={fullpath(imgKey ? item.smallUrl : item)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
