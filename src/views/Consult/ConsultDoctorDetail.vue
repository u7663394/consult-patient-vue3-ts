<script setup lang="ts">
import { ConsultType } from '@/enums'
import { useFollow } from '@/composables'
import { getDoctorDetail } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { Doctor } from '@/types/consult'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const consultStore = useConsultStore()
const doctor = ref<Doctor>()
const { loading, follow } = useFollow('doc')

const loadData = async () => {
  const { data } = await getDoctorDetail(route.params.id as string)
  doctor.value = data
}

const askDoctor = () => {
  if (!doctor.value) return
  consultStore.setType(ConsultType.Doctor)
  consultStore.setDocId(doctor.value.id)
  consultStore.setIllnessLevel(doctor.value.gradeName.includes('三甲') ? 1 : 0)
  router.push('/consult/illness')
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div v-if="doctor" class="doctor-detail-page">
    <cp-nav-bar title="医生详情" />
    <div class="basic-info-bg">
      <div class="basic-info-content">
        <p class="avator-line">
          <img alt="" class="doctor-avator" :src="doctor.avatar" />
          <van-button
            class="follow-btn"
            round
            size="small"
            type="primary"
            plain
            :loading="loading"
            @click="follow(doctor)"
          >
            {{ doctor.likeFlag === 1 ? '已关注' : '+ 关注' }}
          </van-button>
        </p>
        <p class="doctor-line">
          <span class="doctor-name">{{ doctor.name }}</span>
          <span class="dep-info">{{ doctor.depName }} | </span>
          <span class="dep-info">{{ doctor.positionalTitles }}</span>
        </p>
        <p class="hospital-line">
          <span class="grade-name">{{ doctor.gradeName }}</span>
          <span class="hospital-name">{{ doctor.hospitalName }}</span>
        </p>
        <p class="record-list">
          <span class="score">{{ doctor.score }}</span>
          <span> / 接诊数 </span>
          <span class="score">{{ doctor.consultationNum }}</span>
        </p>
      </div>
    </div>

    <div class="intro-content">
      <p class="intro-title">个人简介</p>
      <p class="intro-pre-title">擅长领域</p>
      <div class="adm-ellipsis intro-desc">{{ doctor.major }}</div>
    </div>

    <div class="banner-content">
      <div class="banner-box">
        <van-icon name="chat-o" class="banner-icon" size="33px" color="#fff" />
        <div>
          <p>
            <span class="inquire-type">图文问诊</span>
            <span class="price">¥{{ doctor.serviceFee }}/次</span>
          </p>
          <p class="tips">最长24小时图文多次沟通</p>
        </div>
        <span class="consult-btn" @click="askDoctor">去咨询</span>
      </div>
    </div>

    <div class="evaluate-content">
      <div class="evaluate-header">
        <p><span class="evaluate-title">患者评价</span></p>
        <p><span class="rate-title">评分</span><span class="rate-text">{{ doctor.score }}</span></p>
      </div>
      <div class="no-evaluate">暂无更多评价</div>
    </div>

    <div class="article-list">
      <p class="intro-title">他的文章</p>
      <div class="no-evaluate">暂无文章</div>
    </div>

    <div class="bottom-content">
      <van-button type="primary" round size="large" @click="askDoctor">咨询医生</van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.doctor-detail-page {
  padding-top: 46px;
  padding-bottom: 80px;
  :deep(.van-nav-bar) {
    background: #dff4f1;
  }
  .basic-info-bg {
    background: linear-gradient(180deg, #dff4f1 0%, rgba(44, 181, 165, 0) 100%);
    padding: 15px;
    .basic-info-content {
      position: relative;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 0 11px 0 rgba(229, 229, 229, 0.5);
      padding: 13px;
      .avator-line {
        position: relative;
        text-align: end;
        margin-bottom: 16px;
        .doctor-avator {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: -23px;
        }
      }
      .doctor-line {
        .doctor-name {
          font-size: 21px;
          font-weight: 500;
          color: #121826;
          margin-right: 5px;
        }
        .dep-info {
          font-size: 13px;
          color: #6f6f6f;
        }
      }
      .hospital-line {
        display: flex;
        align-items: center;
        margin: 5px 0;
        .grade-name {
          display: inline-block;
          background: #677fff;
          border-radius: 2px;
          padding: 1px 4px;
          font-size: 9px;
          color: #fff;
          margin-right: 3px;
        }
        .hospital-name {
          font-size: 13px;
          color: #121826;
        }
      }
      .record-list {
        font-size: 12px;
        color: #979797;
        display: flex;
        align-items: center;
        .score {
          color: #03bc8e;
          font-size: 16px;
          font-weight: 600;
          margin: 0 4px;
        }
      }
    }
  }
  .intro-content,
  .article-list {
    padding: 15px;
    .intro-title {
      font-size: 16px;
      font-weight: 500;
      color: #121826;
      margin-bottom: 10px;
    }
    .intro-pre-title {
      font-size: 14px;
      color: #000;
      margin: 5px 0;
    }
    .intro-desc,
    .no-evaluate {
      font-size: 12px;
      color: #3c3e42;
    }
  }
  .banner-content {
    padding: 15px;
    .banner-box {
      padding: 12px 15px;
      background: linear-gradient(281deg, #16c2a3 0%, #1cabca 100%);
      border-radius: 20px;
      display: flex;
      position: relative;
      align-items: center;
      .banner-icon {
        margin-right: 11px;
      }
      .inquire-type {
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        margin-right: 10px;
      }
      .price,
      .tips {
        font-size: 12px;
        color: #fafafa;
      }
      .tips {
        opacity: 0.7;
      }
      .consult-btn {
        position: absolute;
        right: 15px;
        top: 22px;
        padding: 5px 14px;
        background: #fff;
        border-radius: 27px;
        font-size: 14px;
        color: #16c2a3;
      }
    }
  }
  .evaluate-content {
    padding: 0 15px;
    margin-top: 5px;
    .evaluate-header {
      display: flex;
      justify-content: space-between;
      .evaluate-title {
        font-size: 16px;
        font-weight: 500;
        color: #000;
      }
      .rate-title {
        font-size: 13px;
        color: #3c3e42;
        margin-right: 3px;
      }
      .rate-text {
        font-size: 20px;
        font-weight: 500;
        color: #16c2a3;
      }
    }
    .no-evaluate {
      margin-bottom: 11px;
      color: #848484;
      font-size: 12px;
    }
  }
  .bottom-content {
    box-sizing: border-box;
    padding: 15px;
    position: fixed;
    background-color: #fff;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 65px;
    display: flex;
    align-items: center;
    .van-button {
      height: 44px;
      width: 100%;
    }
  }
}
</style>
