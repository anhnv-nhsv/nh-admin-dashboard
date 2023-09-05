<template>
  <div>
    <div>
      <div class="text-gray-600">Parent</div>
      <el-input
        :value="dataRow.clientUserName"
        @input="$emit('submit-page', $event.target.value)"
        placeholder="Enter Parent"
      />
    </div>
    <div class="mt-4">
      <div class="text-gray-600">Tên</div>
      <el-input :value="dataRow.fromIP" placeholder="Enter Name" />
    </div>
    <div class="mt-4">
      <div class="text-gray-600">Hình Ảnh</div>
      <el-input :value="dataRow.uriPage" placeholder="Enter Image" />
    </div>
  </div>
  <div class="mt-3 text-end">
    <el-button type="" @click="handleClose">Cancel</el-button>
    <el-button
      type="submit"
      @click="handleOk(dataRow)"
      class="btn-primary"
      color="#009ef7"
      >Update</el-button
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, toRaw } from "vue";

export default defineComponent({
  name: "edit-page",
  props: {
    dataRow: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    toggle: {
      type: Function,
    },
  },
  components: {},
  setup(props, ctx) {
    const handleOk = (val) => {
      ctx.emit("submit-page", val);
    };
    const handleClose = () => {
      ctx.emit("toggle", false);
    };
    return { handleOk, handleClose };
  },
});
</script>

<style></style>
