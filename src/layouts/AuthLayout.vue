<!--<template>-->
<!--  &lt;!&ndash;begin::Authentication Layout &ndash;&gt;-->
<!--  <div class="d-flex flex-column flex-lg-row flex-column-fluid">-->
<!--    &lt;!&ndash;begin::Body&ndash;&gt;-->
<!--    <div-->
<!--      class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1"-->
<!--    >-->
<!--      &lt;!&ndash;begin::Form&ndash;&gt;-->
<!--      <div class="d-flex flex-center flex-column flex-lg-row-fluid">-->
<!--        &lt;!&ndash;begin::Wrapper&ndash;&gt;-->
<!--        <div class="w-lg-500px p-10">-->
<!--          <router-view></router-view>-->
<!--        </div>-->
<!--        &lt;!&ndash;end::Wrapper&ndash;&gt;-->
<!--      </div>-->
<!--      &lt;!&ndash;end::Form&ndash;&gt;-->

<!--      &lt;!&ndash;begin::Footer&ndash;&gt;-->
<!--      <div class="d-flex flex-center flex-wrap px-5">-->
<!--        &lt;!&ndash;begin::Links&ndash;&gt;-->
<!--        <div class="d-flex fw-semibold text-primary fs-base">-->
<!--          <a href="#" class="px-5" target="_blank">Terms</a>-->

<!--          <a href="#" class="px-5" target="_blank">Plans</a>-->

<!--          <a href="#" class="px-5" target="_blank">Contact Us</a>-->
<!--        </div>-->
<!--        &lt;!&ndash;end::Links&ndash;&gt;-->
<!--      </div>-->
<!--      &lt;!&ndash;end::Footer&ndash;&gt;-->
<!--    </div>-->
<!--    &lt;!&ndash;end::Body&ndash;&gt;-->

<!--    &lt;!&ndash;begin::Aside&ndash;&gt;-->
<!--    <div-->
<!--      class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2"-->
<!--      :style="`background-image: url('${getAssetPath(-->
<!--        '/media/misc/auth-bg.png'-->
<!--      )}')`"-->
<!--    >-->
<!--      &lt;!&ndash;begin::Content&ndash;&gt;-->
<!--      <div-->
<!--        class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100"-->
<!--      >-->
<!--        &lt;!&ndash;begin::Logo&ndash;&gt;-->
<!--        <router-link to="/" class="mb-0 mb-lg-12">-->
<!--          <img-->
<!--            alt="Logo"-->
<!--            :src="getAssetPath('media/logos/nhsv_logo.png')"-->
<!--            class="h-60px h-lg-75px"-->
<!--          />-->
<!--        </router-link>-->
<!--        &lt;!&ndash;end::Logo&ndash;&gt;-->

<!--        &lt;!&ndash;begin::Image&ndash;&gt;-->
<!--        <img-->
<!--          class="d-none d-lg-block mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20"-->
<!--          :src="getAssetPath('media/misc/auth-screens.png')"-->
<!--          alt=""-->
<!--        />-->
<!--        &lt;!&ndash;end::Image&ndash;&gt;-->

<!--        &lt;!&ndash;begin::Title&ndash;&gt;-->
<!--        <h1-->
<!--          class="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7"-->
<!--        >-->
<!--          Fast, Efficient and Productive-->
<!--        </h1>-->
<!--        &lt;!&ndash;end::Title&ndash;&gt;-->

<!--        &lt;!&ndash;begin::Text&ndash;&gt;-->
<!--        <div class="d-none d-lg-block text-white fs-base text-center">-->
<!--          In this kind of post,-->
<!--          <a href="#" class="opacity-75-hover text-warning fw-bold me-1"-->
<!--            >the blogger</a-->
<!--          >-->

<!--          introduces a person they’ve interviewed <br />-->
<!--          and provides some background information about-->

<!--          <a href="#" class="opacity-75-hover text-warning fw-bold me-1"-->
<!--            >the interviewee</a-->
<!--          >-->
<!--          and their <br />-->
<!--          work following this is a transcript of the interview.-->
<!--        </div>-->
<!--        &lt;!&ndash;end::Text&ndash;&gt;-->
<!--      </div>-->
<!--      &lt;!&ndash;end::Content&ndash;&gt;-->
<!--    </div>-->
<!--    &lt;!&ndash;end::Aside&ndash;&gt;-->
<!--  </div>-->
<!--  &lt;!&ndash;end::Authentication Layout &ndash;&gt;-->
<!--</template>-->
<template>
  <div
    class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
    style="background-image: url('media/illustrations/unitedpalms-1/14.png')"
  >
    <!--begin::Content-->
    <div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
      <!--begin::Logo-->
      <a href="#" class="mb-12">
        <img alt="Logo" src="/media/logos/nhsv-logo-horizontal-light.svg" class="h-70px" />
      </a>
      <!--end::Logo-->

      <router-view></router-view>
    </div>
    <!--end::Content-->

    <!--begin::Footer-->
    <!--    <div class="d-flex flex-center flex-column-auto p-10">-->
    <!--      &lt;!&ndash;begin::Links&ndash;&gt;-->
    <!--      <div class="d-flex align-items-center fw-bold fs-6">-->
    <!--        <a href="#" class="text-muted text-hover-primary px-2">About</a>-->

    <!--        <a href="#" class="text-muted text-hover-primary px-2">Contact</a>-->

    <!--        <a href="#" class="text-muted text-hover-primary px-2">Contact Us</a>-->
    <!--      </div>-->
    <!--      &lt;!&ndash;end::Links&ndash;&gt;-->
    <!--    </div>-->
    <!--end::Footer-->
  </div>
</template>
<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "auth-layout",
  components: {},
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      store.addBodyClassname("app-blank");
      store.addBodyClassname("bg-body");
    });

    return {
      getAssetPath,
    };
  },
});
</script>
