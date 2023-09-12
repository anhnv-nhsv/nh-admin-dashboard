<template>
  <div
    class="modal fade"
    id="kt_banner_category_modal"
    ref="bannerCategoryModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-800px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">Add Banner</h2>
          <h2 class="fw-bolder" v-else>Edit Banner</h2>
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
        <div class="modal-body scroll-y mx-5 mx-xl-5 my-7">
          <NhForm>
            <template v-slot:customForm>
              <el-form :model="bannerForm" label-width="160px">
                <el-form-item label="Tên">
                  <el-input
                    v-model="bannerForm.name"
                    placeholder="Tên"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="URL">
                  <el-input
                    v-model="bannerForm.attachUrl"
                    placeholder="URL"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="Hình ảnh">
                  <el-input
                    v-model="bannerForm.imageUrl"
                    placeholder="Hình ảnh"
                    clearable
                    disabled
                  >
                    <template #prepend>
                      <el-button
                        type="primary"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_file_manager_modal">Choose file</el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="Nội dung">
                  <el-input
                    v-model="bannerForm.content"
                    placeholder="Nội dung"
                    clearable
                  />
                </el-form-item>
                <el-form-item>
                  <el-checkbox
                    v-model="bannerForm.isPublish"
                    label="Publish"
                    size="large"
                  />
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
  <FileManagerModal @file-selected="getFileUrl" />
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import NhForm from "@/components/nh-forms/NHForm.vue";
import FileManagerModal from "@/components/modals/file-manager/FileManagerModal.vue";

export default defineComponent({
  name: "banner-category-modal",
  props: {
    action: { type: String, default: () => "add", required: false },
  },
  components: { NhForm, FileManagerModal },
  setup() {
    const bannerForm = reactive({
      name: "",
      attachUrl: "",
      imageUrl: "",
      content: "",
      isPublish: false,
    });

    const handleChangeCategory = (value) => {
      console.log(value);
    };

    const getFileUrl = (val) => {
      console.log("val: ", val);
      bannerForm.imageUrl = val;
    };

    return {
      bannerForm,
      handleChangeCategory,
      getFileUrl,
    };
  },
});
</script>

<style scoped lang="scss">
.btn-upload {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-collapse: inherit !important;
  background-color: #009ef7 !important;
  color: #fff !important;
}
</style>
