<template>
  <!--begin::Footer-->
  <div v-if="footerDisplay" id="kt_app_footer" class="app-footer">
    <!--begin::Footer container-->
    <div
      class="app-container d-flex flex-column flex-md-row flex-center flex-md-stack py-3"
      :class="{
        'container-fluid': footerWidthFluid,
        'container-xxl': !footerWidthFluid,
      }"
    >
      <!--begin::Copyright-->
      <div class="text-dark order-2 order-md-1">
        <span class="text-muted fw-semibold me-1">{{ currentYear }} © </span>
        <a
          href="https://nhsv.vn/"
          target="_blank"
          class="text-gray-800 text-hover-primary"
          >NHSV
        </a>
      </div>
      <!--end::Copyright-->
      <!--begin::Menu-->
      <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
        <li class="menu-item">
          <a
            href="https://keenthemes.com"
            target="_blank"
            class="menu-link px-2"
            >About</a
          >
        </li>
        <li class="menu-item">
          <a
            href="https://devs.keenthemes.com"
            target="_blank"
            class="menu-link px-2"
            >Support</a
          >
        </li>
        <li class="menu-item">
          <a
            href="https://1.envato.market/EA4JP"
            target="_blank"
            class="menu-link px-2"
            >Purchase</a
          >
        </li>
      </ul>
      <!--end::Menu-->
    </div>
    <!--end::Footer container-->
  </div>
  <!--end::Footer-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { footerDisplay, footerWidthFluid } from "@/core/helpers/config";
import moment from "moment";

export default defineComponent({
  name: "theme-footer",
  components: {},
  setup() {
    const currentYear = ref(moment().format("YYYY"));
    return {
      currentYear,
      footerWidthFluid,
      footerDisplay,
    };
  },
});
</script>
