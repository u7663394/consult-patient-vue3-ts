<script setup lang="ts">
import { getAllDep } from '@/services/consult'
import { useConsultStore } from '@/stores'
import { ConsultType } from '@/enums'
import type { TopDep } from '@/types/consult'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DepartmentContent from './components/DepartmentContent.vue'
import DoctorList from './components/DoctorList.vue'

const consultStore = useConsultStore()
const router = useRouter()
const depts = ref<TopDep[]>([])

const loadDepts = async () => {
  const { data } = await getAllDep()
  depts.value = data
}

const allDepts = computed(() => depts.value.map((item) => item.child || []).flat())

const goFastConsult = () => {
  consultStore.setType(ConsultType.Fast)
  router.push('/consult/fast')
}

onMounted(() => {
  loadDepts()
})
</script>

<template>
  <div class="consult-doctor-page">
    <cp-nav-bar
      title="找医生"
      right-text="问诊记录"
      @click-right="$router.push('/user/consult')"
    />

    <div class="search"><cp-icon name="home-search" /> 搜一搜：医生/疾病名称</div>

    <div class="quick-inquary-banner">
      <div class="left-content">
        <van-icon name="chat-o" size="33" />
        <div>
          <p class="slogan">快速问医 无需等待</p>
          <p class="tips">2w+名医在线问诊</p>
        </div>
      </div>
      <span class="inquary-btn" @click="goFastConsult">
        去咨询
      </span>
    </div>

    <department-content :depts="depts" />

    <div class="famous-doctor-list">
      <div>
        <p class="title-text">名医推荐</p>
        <p class="sub-title">获取更多诊疗建议</p>
      </div>
      <van-tabs v-if="allDepts.length" shrink sticky>
        <van-tab v-for="item in allDepts" :key="item.id" :title="item.name">
          <doctor-list :dep-id="item.id" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.consult-doctor-page {
  padding: 46px 15px 0;
  .search {
    margin-top: 10px;
    height: 40px;
    border-radius: 20px;
    box-shadow: 0 15px 22px -7px rgba(224, 236, 250, 0.8);
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: var(--cp-dark);
    font-size: 13px;
    .cp-icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }
  .quick-inquary-banner {
    display: flex;
    align-items: center;
    margin: 15px 0;
    justify-content: space-between;
    height: 75px;
    background: #fafafa;
    border-radius: 18px;
    padding: 0 15px;
    .left-content {
      display: flex;
      align-items: center;
      .van-icon {
        margin-right: 10px;
        color: var(--cp-primary);
      }
      .slogan {
        font-size: 16px;
        font-weight: 500;
        color: var(--cp-primary);
      }
      .tips {
        font-size: 12px;
        color: #848484;
      }
    }
    .inquary-btn {
      width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(44, 181, 165, 0.1);
      border-radius: 25px;
      font-size: 14px;
      color: #2cb5a5;
    }
  }
  .famous-doctor-list {
    margin-top: 15px;
    .title-text {
      font-size: 16px;
      font-weight: 500;
      color: #121826;
    }
    .sub-title {
      font-size: 12px;
      color: #c3c3c5;
    }
  }
}
</style>
