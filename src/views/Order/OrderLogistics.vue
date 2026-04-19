<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/services/order'
import type { Location, Logistics } from '@/types/order'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import carImg from '@/assets/car.png'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'

/**
 * 获取并渲染物流信息
 */
const logistics = ref<Logistics>()
const route = useRoute()
onMounted(async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  logistics.value = res.data
})

/**
 * 使用高德地图
 *   1. 引入安全配置，设置 securityJsCode
 *   2. 使用 AMapLoader 加载地图，传入 key 和 version
 *   3. 在 then 回调中使用 AMap 初始化地图
 *   4. 绘制物流轨迹
 */
window._AMapSecurityConfig = {
  securityJsCode: '415e917da833efcf2d5b69f4d821784b',
}
// 2. 加载高德地图
onMounted(async () => {
  AMapLoader.load({
    key: '4eed3d61125c8b9c168fc22414aaef7e',
    version: '2.0',
  }).then((AMap) => {
    // 3. 使用 Amap 初始化地图
    const map = new AMap.Map('map', {
      mapStyle: 'amap://styles/whitesmoke',
      zoom: 12,
    })
    // 4. 绘制物流轨迹
    AMap.plugin('AMap.Driving', function () {
      const driving = new AMap.Driving({
        map: map,
        showTraffic: false, // 不显示路况
        hideMarkers: true, // 隐藏默认标记
      })
      if (logistics.value?.logisticsInfo && logistics.value.logisticsInfo.length >= 2) {
        // 自定义标记函数
        const getMarker = (point: Location, image: string, width = 25, height = 30) => {
          const icon = new AMap.Icon({
            size: new AMap.Size(width, height),
            image,
            imageSize: new AMap.Size(width, height),
          })
          const marker = new AMap.Marker({
            position: [point?.longitude, point?.latitude],
            icon: icon,
            offset: new AMap.Pixel(-width / 2, -height),
          })
          return marker
        }
        const pathList = [...logistics.value.logisticsInfo]
        const start = pathList.shift() // 起点
        const startMarker = getMarker(start!, startImg)
        map.add(startMarker)
        const end = pathList.pop() // 终点
        const endMarker = getMarker(end!, endImg)
        map.add(endMarker)
        driving.search(
          [start?.longitude, start?.latitude],
          [end?.longitude, end?.latitude],
          {
            waypoints: pathList.map((ele) => [ele.longitude, ele.latitude]),
          },
          () => {
            // 规划完毕回调
            const currPoint = logistics.value?.currentLocationInfo
            const currMarker = getMarker(currPoint!, carImg, 33, 20)
            map.add(currMarker)
            // 3s 后定位到中间并缩放
            setTimeout(() => {
              map.setFitView([currMarker])
              map.setZoom(10)
            }, 3000)
          },
        )
      }
    })
  })
})
</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logistics?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ logistics?.statusValue }} 预计{{ logistics?.estimatedTime }}送达</p>
        <p class="predict">
          <span>{{ logistics?.name }}</span>
          <span>{{ logistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <!-- 
       steps组件:
         1. direction="vertical" 竖向展示
         2. :active="0" 当前步骤索引
      -->
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in logistics?.list" :key="item.id">
          <p class="status">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
