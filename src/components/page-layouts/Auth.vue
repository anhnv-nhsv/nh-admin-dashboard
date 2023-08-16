<template>
  <div
    class="
      d-flex
      flex-column flex-column-fluid
      bgi-position-y-bottom
      position-x-center
      bgi-no-repeat bgi-size-contain bgi-attachment-fixed
    "
    style="background-image: url('media/illustrations/unitedpalms-1/14.png')"
  >
    <!--begin::Content-->
    <div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
      <!--begin::Logo-->
      <a href="#" class="mb-12">
        <img alt="Logo" src="media/logos/nhsv_logo.png" class="h-100px" />
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
import { defineComponent, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";

export default defineComponent({
  name: "auth",
  components: {},
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch(Actions.ADD_BODY_CLASSNAME, "bg-body");
    });

    onUnmounted(() => {
      store.dispatch(Actions.REMOVE_BODY_CLASSNAME, "bg-body");
    });
  },
});
</script>
