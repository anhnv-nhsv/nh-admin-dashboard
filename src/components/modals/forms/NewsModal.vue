<template>
  <div
    class="modal fade"
    id="kt_news_modal"
    ref="newsModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered mw-1000px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">Add News</h2>
          <h2 class="fw-bolder" v-else>Edit News</h2>
          <div
            id="kt_customer_export_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body mx-5 mx-xl-5 my-7">
          <NhForm seoable>
            <template v-slot:customForm>
              <el-form :model="newsForm" label-width="160px">
                <el-form-item>
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
                </el-form-item>
                <div class="tab-content" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="nh_tab_pane_1"
                    role="tabpanel"
                  >
                    <el-form-item label="Tiêu đề">
                      <el-input
                        v-model="newsForm.titleVn"
                        placeholder="Tiếng Việt"
                        clearable
                        @input="generateSlug(newsForm.titleVn)"
                      />
                    </el-form-item>
                    <el-form-item label="Nội dung">
                      <NhEditor v-model="newsForm.contentVn" placeholder="Tiếng Việt" />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_2" role="tabpanel">
                    <el-form-item label="Tiêu đề">
                      <el-input
                        v-model="newsForm.titleEn"
                        placeholder="Tiếng Anh"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item label="Nội dung">
                      <NhEditor v-model="newsForm.contentEn" placeholder="Tiếng Anh" />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_3" role="tabpanel">
                    <el-form-item label="Tiêu đề">
                      <el-input
                        v-model="newsForm.titleKr"
                        placeholder="Tiếng Hàn"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item label="Nội dung">
                      <NhEditor v-model="newsForm.contentKr" placeholder="Tiếng Hàn" />
                    </el-form-item>
                  </div>
                </div>
                <el-form-item label="Chọn chuyên mục cha">
                  <el-cascader
                    v-model="newsForm.parentCategory"
                    :options="categories"
                    :props="cascaderConfig"
                    clearable
                    filterable
                    style="width: 100%"
                    @change="handleChangeCategory"
                  />
                </el-form-item>
                <el-form-item label="Hình ảnh">
                  <el-upload
                    ref="uploadRef"
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false"
                    :limit="1"
                    :on-exceed="handleFileExceed"
                    :on-change="handleImageChange"
                    :class="{ 'hide-upload': fileList.length > 0 }"
                  >
                    <el-icon><Plus /></el-icon>
                    <template #file="{ file }">
                      <div>
                        <img
                          class="el-upload-list__item-thumbnail"
                          :src="file.url"
                          alt=""
                        />
                        <span class="el-upload-list__item-actions">
                          <span
                            class="el-upload-list__item-preview"
                            @click="handlePictureCardPreview(file)"
                          >
                            <el-icon><zoom-in /></el-icon>
                          </span>
                          <span
                            class="el-upload-list__item-delete"
                            @click="handleRemove"
                          >
                            <el-icon><Delete /></el-icon>
                          </span>
                        </span>
                      </div>
                    </template>
                  </el-upload>
                  <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                  </el-dialog>
                </el-form-item>
                <el-form-item label="URL">
                  <el-input
                    v-model="newsForm.url"
                    placeholder="URL"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="Tin nổi bật">
                  <el-switch v-model="newsForm.isFeatured" />
                </el-form-item>
                <el-form-item label="Hiển thị ngay">
                  <el-switch v-model="newsForm.isPublish" />
                </el-form-item>
              </el-form>
            </template>
          </NhForm>
        </div>
        <div class="modal-footer">
          <button
            type="reset"
            id="kt_modal_test_editor_cancel"
            class="btn btn-light me-3"
            data-bs-dismiss="modal"
          >
            Discard
          </button>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import NhForm from "@/components/nh-forms/NHForm.vue";
import { Delete, Plus, Refresh, ZoomIn } from "@element-plus/icons-vue";
import type {
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from "element-plus";
import { ElMessage } from "element-plus";
import NhEditor from "@/components/editor/NHEditor.vue";

export default defineComponent({
  name: "news-modal",
  props: {
    action: { type: String, default: () => "add", required: false },
  },
  components: { NhEditor, NhForm, Delete, Plus, ZoomIn },
  setup: function () {
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
    const newsForm = reactive({
      titleVn: "",
      titleEn: "",
      titleKr: "",
      contentVn: "",
      contentEn: "",
      contentKr: "",
      featuredImgUrl: "",
      url: "/tin-tuc/.html",
      parentCategory: "",
      isPublish: true,
      isFeatured: false,
    });
    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);
    const uploadRef = ref<UploadInstance>();
    const fileList = ref<any>([]);

    const handleChangeCategory = (value) => {
      console.log(value);
    };

    const generateSlug = (title) => {
      newsForm.url = "/tin-tuc/" + toSlug(title) + ".html";
    };

    const toSlug = (str) => {
      // Chuyển hết sang chữ thường
      str = str.toLowerCase();

      // xóa dấu
      str = str
        .normalize("NFD") // chuyển chuỗi sang unicode tổ hợp
        .replace(/[\u0300-\u036f]/g, ""); // xóa các ký tự dấu sau khi tách tổ hợp

      // Thay ký tự đĐ
      str = str.replace(/[đĐ]/g, "d");

      // Xóa ký tự đặc biệt
      str = str.replace(/([^0-9a-z-\s])/g, "");

      // Xóa khoảng trắng thay bằng ký tự -
      str = str.replace(/(\s+)/g, "-");

      // Xóa ký tự - liên tiếp
      str = str.replace(/-+/g, "-");

      // xóa phần dư - ở đầu & cuối
      str = str.replace(/^-+|-+$/g, "");

      // return
      return str;
    };

    const handleRemove = (file: UploadFile) => {
      uploadRef.value?.handleRemove(file);
      fileList.value = [];
    };

    const handlePictureCardPreview = (file: UploadFile) => {
      dialogImageUrl.value = file.url!;
      dialogVisible.value = true;
    };

    const handleImageChange = (uploadFile: UploadFile) => {
      fileList.value = [uploadFile];
    };

    const handleFileExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
      uploadRef.value?.clearFiles();
      fileList.value = [...uploadFiles];
      uploadRef.value?.handleStart(files[0] as UploadRawFile);
    };

    return {
      categories,
      cascaderConfig,
      newsForm,
      Delete,
      Plus,
      ZoomIn,
      dialogImageUrl,
      dialogVisible,
      uploadRef,
      fileList,
      handleChangeCategory,
      generateSlug,
      handleImageChange,
      handleRemove,
      handlePictureCardPreview,
      handleFileExceed,
    };
  },
});
</script>

<style scoped lang="scss">
.tab-content {
  width: 100%;
}
.avatar-uploader .avatar {
  width: 100%;
  //height: 178px;
  display: block;
}
.hide-upload {
  :deep(div.el-upload.el-upload--picture-card) {
    display: none !important;
  }
}
</style>
