<script setup lang="ts">
import { getMedicineDetail } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { MedicineDetail } from '@/types/consult'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MedicineAction from './components/MedicineAction.vue'

const route = useRoute()
const consultStore = useConsultStore()
const id = computed(() => route.params.id as string)
const detail = ref<MedicineDetail>()

const loadDetail = async () => {
  const { data } = await getMedicineDetail(id.value)
  detail.value = data
}

const onAddToCart = () => {
  if (!detail.value) return
  const medicines = [...(consultStore.consult.medicines || [])]
  const medicine = medicines.find((item) => item.id === detail.value?.id)
  if (medicine) {
    medicine.quantity = `${+medicine.quantity + 1}`
  } else {
    medicines.push({
      amount: detail.value.amount,
      avatar: detail.value.avatar,
      id: detail.value.id,
      name: detail.value.name,
      prescriptionFlag: detail.value.prescriptionFlag,
      specs: detail.value.specs,
      usageDosag: detail.value.usageDosag,
      quantity: '1',
    })
  }
  consultStore.setMedicines(medicines)
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div v-if="detail" class="medicine-detail-page">
    <cp-nav-bar :title="detail.name" />
    <van-swipe indicator-color="#fff">
      <van-swipe-item v-for="(item, index) in detail.mainPictures" :key="index">
        <img :src="item" alt="" />
      </van-swipe-item>
    </van-swipe>

    <div class="detail-top">
      <div class="info">
        <p class="name">
          <span>{{ detail.name }}</span>
        </p>
        <p class="size">
          <van-tag v-if="detail.prescriptionFlag === 1">处方药</van-tag>
          <span>{{ detail.specs }}</span>
        </p>
        <p class="price">￥{{ detail.amount }}</p>
      </div>
    </div>

    <div class="pay-space"></div>

    <div class="detail-bottom">
      <div class="info-item">
        <div class="info-title">药品名称</div>
        <div class="info-desc">{{ detail.name }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">品牌</div>
        <div class="info-desc">{{ detail.brand || '无' }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">功能主治</div>
        <div class="info-desc">{{ detail.indicationsFunction }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">不良反应</div>
        <div class="info-desc">{{ detail.untowardReaction }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">禁忌</div>
        <div class="info-desc">{{ detail.contraindication }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">注意事项</div>
        <div class="info-desc">{{ detail.preparation }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">有效期</div>
        <div class="info-desc">{{ detail.expiration }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">执行标准</div>
        <div class="info-desc">{{ detail.standard }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">批准文号</div>
        <div class="info-desc">{{ detail.approvalNo }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">生产企业</div>
        <div class="info-desc">{{ detail.manufacturer }}</div>
      </div>
    </div>

    <medicine-action from="detail" @add-to-cart="onAddToCart" />
  </div>
</template>

<style scoped lang="scss">
.medicine-detail-page {
  padding: 46px 0 50px;

  .van-swipe {
    img {
      width: 100%;
      display: block;
    }
  }

  .detail-top {
    padding: 15px;
    .info {
      padding-left: 15px;
      width: 250px;
      .name {
        display: flex;
        font-size: 15px;
        margin-bottom: 5px;
      }
      .size {
        margin-bottom: 5px;
        .van-tag {
          background-color: var(--cp-primary);
          vertical-align: middle;
        }
        span:not(.van-tag) {
          margin-left: 10px;
          color: var(--cp-tag);
          vertical-align: middle;
        }
      }
      .price {
        font-size: 16px;
        color: #eb5757;
      }
    }
  }

  .detail-bottom {
    padding: 15px;
    .info-item {
      margin-bottom: 30px;
      .info-title {
        font-size: 18px;
        font-weight: 500;
        color: #000;
      }
      .info-desc {
        margin-top: 10px;
        font-size: 14px;
        color: #3c3e42;
      }
    }
  }

  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
}
</style>
