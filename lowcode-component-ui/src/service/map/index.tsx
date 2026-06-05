import { useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import gcoord from "gcoord";
import { get, isEmpty } from "lodash";
import {
  CustomControl,
  GeoLocateControl,
  LarkMap,
  LocationSearch,
  Popup,
  ZoomControl,
} from "@antv/larkmap";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useModuleContext } from "@brushes/component-core";

const MapComponentJsx = ({
  dataPath = "",
  storeKey,
  height = 400,
}: {
  storeKey: string;
  dataPath?: string;
  height: number;
}) => {
  const [center, setCenter] = useState<[number, number]>([
    121.3408091, 31.1383892,
  ]);
  const setOnChange = useModuleContext((s) => s.moduleStore.onChange);
  const _skuInfo = useModuleContext((s) => s.moduleStore[storeKey]) || {};

  const defaultValue = useMemo(() => {
    if (dataPath) {
      return get(_skuInfo, dataPath);
    }
    return typeof _skuInfo === "object" ? "" : _skuInfo;
  }, [_skuInfo, dataPath]);

  const addressRef = useRef({});
  const [location, setLocation] = useState("");
  const [lngLat, setLngLat] = useState({ lng: 121.3408091, lat: 31.1383892 });
  useEffect(() => {
    (async () => {
      if (!defaultValue) return;
      fetch(
        `https://restapi.amap.com/v3/geocode/geo?key=98d10f05a2da96697313a2ce35ebf1a2&address=${defaultValue}`,
        {
          method: "get",
        },
      )
        .then((res) => res.json())
        .then((data) => {
          const { info } = data;
          if (info === "OK") {
            const [longitude, latitude] = get(
              data,
              "geocodes[0].location",
            ).split(",");
            transform([longitude, latitude]);
            setCenter([+longitude, +latitude]);
          } else {
            message.info("地址无效");
            setLocation("");
            setOnChange?.("");
          }
        });
    })();
  }, [defaultValue]);

  const onSceneLoaded = (scene) => {
    scene.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      transformBounds(`${lng},${lat}`);
      setLngLat({ lng, lat });
    });
  };

  const transform = (position) => {
    const [lng, lat] = position;
    setLngLat({ lng, lat });
    transformBounds(`${lng},${lat}`);
    return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
  };

  const transformBounds = (result: string) => {
    fetch(
      `https://restapi.amap.com/v3/geocode/regeo?key=98d10f05a2da96697313a2ce35ebf1a2&location=${result}`,
      {
        method: "get",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        const { info } = data;
        if (info === "OK") {
          const result = get(data, "regeocode.formatted_address");
          const { province, city, district } = get(
            data,
            "regeocode.addressComponent",
          );
          let areaName = isEmpty(city) ? district : city;
          addressRef.current = {
            goodsProperty: province,
            areaName,
          };
          setLocation(result);
          setOnChange?.(result);
        } else {
          setLocation("");
          setOnChange?.("");
        }
      });
  };

  const onChange = (e, info) => {
    const { district, longitude, latitude, address } = info;
    setCenter([+longitude, +latitude]);
    setLngLat({ lng: longitude, lat: latitude });
    setLocation(district + address);
    setOnChange?.(district + address);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <LarkMap
        mapOptions={{
          center,
          zoom: 14,
        }}
        logoVisible={false}
        mapType="Tencent"
        style={{ height }}
        onSceneLoaded={onSceneLoaded}
      >
        <CustomControl position="topleft">
          <div onClick={(e) => e.stopPropagation()}>
            <LocationSearch
              searchParams={{
                key: "98d10f05a2da96697313a2ce35ebf1a2",
                location: location || defaultValue,
              }}
              autoFocus
              value={null}
              onChange={onChange}
            />
          </div>
        </CustomControl>
        <GeoLocateControl transform={transform} />
        <ZoomControl />
        <Popup
          lngLat={lngLat}
          title={<div>实时展示经纬度</div>}
          closeButton={false}
          closeOnClick={false}
        >
          <div>lat: {lngLat.lat}</div>
          <div>lng: {lngLat.lng}</div>
        </Popup>
      </LarkMap>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "570px 80px 80px",
          columnGap: 10,
          alignItems: "center",
        }}
      >
        <p style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          所选地址：{location || defaultValue}
        </p>
      </div>
    </div>
  );
};

export const MapComponent = HOCCodeWrapComponent(MapComponentJsx);
