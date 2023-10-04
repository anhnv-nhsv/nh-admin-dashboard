<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column"></div>
      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <NhMenu @on-change="onListChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import NhMenu from "@/components/menu/NHMenu.vue";

export default defineComponent({
  name: "home-menu",
  components: { NhMenu },
  setup() {
    const nestableItems = ref([]);
    const onListChange = (list) => {
      // nestableItems.value = list;
      console.log(list);
    };

    return {
      nestableItems,
      onListChange,
    };
  },
});
</script>

<style scoped lang="scss"></style>
