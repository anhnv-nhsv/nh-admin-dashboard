<template>
  <div
    class="modal fade"
    id="kt_contact_category_modal"
    ref="contactCategoryModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-800px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder" v-if="action === 'add'">
            Add Contact Category
          </h2>
          <h2 class="fw-bolder" v-else>Edit Contact Category</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_customer_export_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body scroll-y mx-5 mx-xl-5 my-7">
          <!--begin::Form-->
          <NhForm seoable>
            <template v-slot:customForm>
              <el-form :model="contactForm" label-width="160px">
                <el-form-item label="Tên chuyên mục">
                  <ul
                    class="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6"
                  >
                    <li class="nav-item">
                      <a
                        class="nav-link active"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_1"
                        >Tiếng Việt</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_2"
                        >Tiếng Anh</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_3"
                        >Tiếng Hàn</a
                      >
                    </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                    <div
                      class="tab-pane fade show active"
                      id="nh_tab_pane_1"
                      role="tabpanel"
                    >
                      <el-input
                        v-model="contactForm.titleVn"
                        placeholder="Tiếng Việt"
                        clearable
                        @input="generateSlug(contactForm.titleVn)"
                      />
                    </div>
                    <div
                      class="tab-pane fade"
                      id="nh_tab_pane_2"
                      role="tabpanel"
                    >
                      <el-input
                        v-model="contactForm.titleEn"
                        placeholder="Tiếng Anh"
                        clearable
                      />
                    </div>
                    <div
                      class="tab-pane fade"
                      id="nh_tab_pane_3"
                      role="tabpanel"
                    >
                      <el-input
                        v-model="contactForm.titleKr"
                        placeholder="Tiếng Hàn"
                        clearable
                      />
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="URL">
                  <el-input
                    v-model="contactForm.url"
                    placeholder="URL"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="Chọn chuyên mục cha">
                  <el-cascader
                    v-model="contactForm.parentCategory"
                    :options="categories"
                    :props="cascaderConfig"
                    clearable
                    filterable
                    style="width: 100%"
                    @change="handleChangeCategory"
                  />
                </el-form-item>
                <el-form-item>
                  <el-checkbox
                    v-model="contactForm.isPublish"
                    label="Publish"
                    size="large"
                  />
                </el-form-item>
              </el-form>
            </template>
          </NhForm>
          <!--end::Form-->
        </div>
        <!--end::Modal body-->
        <div class="modal-footer">
          <!--begin::Button-->
          <button
            type="reset"
            id="kt_modal_test_editor_cancel"
            class="btn btn-light me-3"
            data-bs-dismiss="modal"
          >
            Discard
          </button>
          <!--end::Button-->

          <!--begin::Button-->
          <button class="btn btn-lg btn-primary" type="submit">
            <span v-if="true" class="indicator-label">
              Submit
              <span class="svg-icon svg-icon-3 ms-2 me-0">
                <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
              </span>
            </span>
            <span v-if="false" class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
          <!--end::Button-->
        </div>
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import NhForm from "@/components/nh-forms/NHForm.vue";

export default defineComponent({
  name: "contact-category-modal",
  props: {
    action: { type: String, default: () => "add", required: false },
  },
  components: { NhForm },
  setup() {
    const categories = [
      {
        value: "guide",
        label: "Guide",
        children: [
          {
            value: "disciplines",
            label: "Disciplines",
            children: [
              {
                value: "consistency",
                label: "Consistency",
              },
              {
                value: "feedback",
                label: "Feedback",
              },
              {
                value: "efficiency",
                label: "Efficiency",
              },
              {
                value: "controllability",
                label: "Controllability",
              },
            ],
          },
          {
            value: "navigation",
            label: "Navigation",
            children: [
              {
                value: "side nav",
                label: "Side Navigation",
              },
              {
                value: "top nav",
                label: "Top Navigation",
              },
            ],
          },
        ],
      },
      {
        value: "component",
        label: "Component",
        children: [
          {
            value: "basic",
            label: "Basic",
            children: [
              {
                value: "layout",
                label: "Layout",
              },
              {
                value: "color",
                label: "Color",
              },
              {
                value: "typography",
                label: "Typography",
              },
              {
                value: "icon",
                label: "Icon",
              },
              {
                value: "button",
                label: "Button",
              },
            ],
          },
          {
            value: "form",
            label: "Form",
            children: [
              {
                value: "radio",
                label: "Radio",
              },
              {
                value: "checkbox",
                label: "Checkbox",
              },
              {
                value: "input",
                label: "Input",
              },
              {
                value: "input-number",
                label: "InputNumber",
              },
              {
                value: "select",
                label: "Select",
              },
              {
                value: "cascader",
                label: "Cascader",
              },
              {
                value: "switch",
                label: "Switch",
              },
              {
                value: "slider",
                label: "Slider",
              },
              {
                value: "time-picker",
                label: "TimePicker",
              },
              {
                value: "date-picker",
                label: "DatePicker",
              },
              {
                value: "datetime-picker",
                label: "DateTimePicker",
              },
              {
                value: "upload",
                label: "Upload",
              },
              {
                value: "rate",
                label: "Rate",
              },
              {
                value: "form",
                label: "Form",
              },
            ],
          },
          {
            value: "data",
            label: "Data",
            children: [
              {
                value: "table",
                label: "Table",
              },
              {
                value: "tag",
                label: "Tag",
              },
              {
                value: "progress",
                label: "Progress",
              },
              {
                value: "tree",
                label: "Tree",
              },
              {
                value: "pagination",
                label: "Pagination",
              },
              {
                value: "badge",
                label: "Badge",
              },
            ],
          },
          {
            value: "notice",
            label: "Notice",
            children: [
              {
                value: "alert",
                label: "Alert",
              },
              {
                value: "loading",
                label: "Loading",
              },
              {
                value: "message",
                label: "Message",
              },
              {
                value: "message-box",
                label: "MessageBox",
              },
              {
                value: "notification",
                label: "Notification",
              },
            ],
          },
          {
            value: "navigation",
            label: "Navigation",
            children: [
              {
                value: "menu",
                label: "Menu",
              },
              {
                value: "tabs",
                label: "Tabs",
              },
              {
                value: "breadcrumb",
                label: "Breadcrumb",
              },
              {
                value: "dropdown",
                label: "Dropdown",
              },
              {
                value: "steps",
                label: "Steps",
              },
            ],
          },
          {
            value: "others",
            label: "Others",
            children: [
              {
                value: "dialog",
                label: "Dialog",
              },
              {
                value: "tooltip",
                label: "Tooltip",
              },
              {
                value: "popover",
                label: "Popover",
              },
              {
                value: "card",
                label: "Card",
              },
              {
                value: "carousel",
                label: "Carousel",
              },
              {
                value: "collapse",
                label: "Collapse",
              },
            ],
          },
        ],
      },
      {
        value: "resource",
        label: "Resource",
        children: [
          {
            value: "axure",
            label: "Axure Components",
          },
          {
            value: "sketch",
            label: "Sketch Templates",
          },
          {
            value: "docs",
            label: "Design Documentation",
          },
        ],
      },
    ];
    const cascaderConfig = {
      expandTrigger: "hover" as const,
    };
    const contactForm = reactive({
      titleVn: "",
      titleEn: "",
      titleKr: "",
      url: "/chuyen-muc-tin/.html",
      parentCategory: "",
      isPublish: false,
    });

    const handleChangeCategory = (value) => {
      console.log(value);
    };

    const generateSlug = (title) => {
      contactForm.url = "/chuyen-muc-tin/" + toSlug(title) + ".html";
    };

    const toSlug = (str) => {
      /* eslint-disable no-useless-escape */
      const a =
        "àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;";
      const b =
        "aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------";
      const p = new RegExp(a.split("").join("|"), "g");
      return str
        .toString()
        .toLowerCase()
        .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a")
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e")
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, "i")
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o")
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u")
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y")
        .replace(/đ/gi, "d")
        .replace(/\s+/g, "-")
        .replace(p, (c) => b.charAt(a.indexOf(c)))
        .replace(/&/g, "-and-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    };

    return {
      categories,
      cascaderConfig,
      contactForm,
      handleChangeCategory,
      generateSlug,
    };
  },
});
</script>

<style scoped lang="scss">
.tab-content {
  width: 100%;
}
</style>
