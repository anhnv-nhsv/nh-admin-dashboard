<template>
  <div class="mb-5 hover-scroll-x">
    <div class="d-grid">
      <ul class="nav nav-tabs flex-nowrap text-nowrap">
        <li class="nav-item">
          <a
            class="nav-link btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0 active"
            data-bs-toggle="tab"
            href="#kt_tab_pane_1"
            >Basic</a
          >
        </li>
        <li class="nav-item" v-if="seoable">
          <a
            class="nav-link btn btn-active-light btn-color-gray-600 btn-active-color-primary rounded-bottom-0"
            data-bs-toggle="tab"
            href="#kt_tab_pane_2"
            >SEO</a
          >
        </li>
      </ul>
    </div>
  </div>

  <div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel">
      <slot name="customForm">Insert custom form here</slot>
    </div>
    <div class="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
      <el-form label-width="120px" :model="seoData">
        <el-form-item label="Seo title">
          <el-input
            v-model="seoData.title"
            placeholder="Seo title"
            clearable
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="Seo keyword">
          <el-input
            v-model="seoData.keywords"
            placeholder="Seo keyword"
            clearable
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="Seo description">
          <el-input
            v-model="seoData.description"
            placeholder="Seo description"
            type="textarea"
            clearable
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
export default defineComponent({
  name: "nh-form",
  props: {
    seoable: { type: Boolean, required: false, default: false },
    modelValue: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    const seoData = reactive({
      title: "",
      keywords: "",
      description: "",
    });
    watch(
      () => ({ ...seoData }),
      (newValue) => {
        ctx.emit("update:modelValue", newValue);
      }
    );
    const test = () => {
      return seoData;
    };
    return { seoData, test };
  },
});
</script>

<style scoped lang="scss"></style>
