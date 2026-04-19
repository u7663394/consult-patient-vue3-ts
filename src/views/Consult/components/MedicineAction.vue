<script setup lang="ts">
import { ConsultType } from '@/enums'
import { createConsultOrder } from '@/services/consult'
import { useConsultStore } from '@/stores'
import { getCreateOrderParams } from '@/utils/createOrderParams'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import MedicineCard from './MedicineCard.vue'

withDefaults(
  defineProps<{
    from?: 'list' | 'detail'
  }>(),
  {
    from: 'list',
  },
)

const emit = defineEmits<{
  (e: 'addToCart'): void
}>()

const consultStore = useConsultStore()
const router = useRouter()
const show = ref(false)

const totalPrice = computed(() => {
  const total =
    consultStore.consult.medicines?.reduce((sum, item) => sum + +item.amount * +item.quantity, 0) || 0
  return total.toFixed(2)
})

const cartLength = computed(() => consultStore.consult.medicines?.length || 0)

const openCart = () => {
  if (cartLength.value === 0) return showToast('请选择药品')
  show.value = true
}

const clear = () => {
  consultStore.setMedicines([])
  show.value = false
}

const onAddToCart = () => {
  emit('addToCart')
}

const onAskDocotor = async () => {
  const medicines = consultStore.consult.medicines || []
  if (medicines.length === 0) return showToast('请先选药')
  const params = getCreateOrderParams(consultStore.consult, ConsultType.Medication)
  try {
    const { data } = await createConsultOrder(params)
    router.push(`/room?orderId=${data.id}&from=medicine`)
  } catch {
    return showDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写',
      closeOnPopstate: false,
    }).then(() => {
      router.push('/')
    })
  } finally {
    consultStore.clear()
  }
}
</script>

<template>
  <van-action-bar>
    <van-action-bar-icon
      icon="cart-o"
      :badge="cartLength === 0 ? '' : cartLength"
      :color="cartLength > 0 ? '#323233' : '#eee'"
      @click="openCart"
    />
    <div class="total-price">￥ {{ totalPrice }}</div>
    <van-action-bar-button
      v-if="from === 'list'"
      type="primary"
      text="申请开方"
      @click="onAskDocotor"
    />
    <van-action-bar-button v-else type="primary" text="加入药箱" @click="onAddToCart" />
  </van-action-bar>

  <van-action-sheet v-model:show="show">
    <div class="content">
      <div class="content-header">
        <div class="content-header-left">
          <span>药品清单</span><span>共{{ cartLength }}件商品</span>
        </div>
        <div class="content-header-right" @click="clear">
          <van-icon name="delete-o" />
          <span>清空</span>
        </div>
      </div>
      <div class="medicine-list">
        <medicine-card
          v-for="item in consultStore.consult.medicines"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
    <van-action-bar>
      <van-action-bar-icon
        icon="cart-o"
        :color="cartLength > 0 ? '#323233' : '#eee'"
        :badge="cartLength === 0 ? '' : cartLength"
      />
      <div class="total-price">￥ {{ totalPrice }}</div>
      <van-action-bar-button type="primary" text="申请开方" @click="onAskDocotor" />
    </van-action-bar>
  </van-action-sheet>
</template>

<style scoped lang="scss">
.van-action-bar {
  border-top: 1px solid rgba(237, 237, 237, 0.9);
  .total-price {
    width: 200px;
    font-size: 24px;
    line-height: 18px;
    font-weight: 700;
    color: #121826;
  }
}

.content {
  --content-height: 400px;
  --content-header-height: 25px;
  padding: 16px;
  height: var(--content-height);
  .content-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--content-header-height);
    padding-bottom: 10px;
    &-left {
      span {
        font-size: 16px;
        color: #000;
        margin-right: 10px;
      }
      span + span {
        font-size: 13px;
        color: var(--cp-primary);
      }
    }
    &-right {
      span {
        margin-left: 5px;
      }
    }
  }
  .medicine-list {
    padding-bottom: 45px;
  }
}
</style>
