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
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="Seo keyword">
          <el-input
            v-model="seoData.keywords"
            placeholder="Seo keyword"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="Seo description">
          <el-input
            v-model="seoData.description"
            placeholder="Seo description"
            type="textarea"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
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
    rowValue: {
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
    const seoDataRow = ref(props.rowValue);
    let seoObj = ref(JSON.parse(JSON.stringify(seoDataRow.value)));
    watch(
      () => props.rowValue,
      (newVal) => {
        seoObj.value = newVal;

        if (typeof newVal === "object") {
          seoData.title =
            seoObj.value.seo_title == "undefined" ||
            seoObj.value.seo_title == null
              ? ""
              : seoObj.value.seo_title;
          seoData.keywords =
            seoObj.value.seo_keyword == "undefined" ||
            seoObj.value.seo_keyword == null
              ? ""
              : seoObj.value.seo_keyword;
          seoData.description =
            seoObj.value.seo_description == "undefined" ||
            seoObj.value.seo_description == null
              ? ""
              : seoObj.value.seo_description;
        }
      }
    );
    watch(
      () => ({ ...seoData }),
      (newValue) => {
        ctx.emit("update:modelValue", newValue);
        ctx.emit("get-modelValue", newValue);
      }
    );
    const test = () => {
      return seoData;
    };
    return { seoData, seoObj, test };
  },
});
</script>

<style scoped lang="scss"></style>
