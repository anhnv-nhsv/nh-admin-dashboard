<template>
  <div class="col-xs-6">
    <a class="btn btn-info" title="" @click="$router.go(-1)"
      ><i class="fa fa-chevron-left"></i> Quay lại</a
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, toRaw } from "vue";

export default defineComponent({
  name: "create-banner",
  props: {},
  components: {},
  setup(props, ctx) {},
});
</script>

<style></style>
