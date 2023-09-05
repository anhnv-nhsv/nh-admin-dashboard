<template>
  <div
    class="modal fade"
    id="kt_customer_import_modal"
    ref="importCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-500px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">Import Customers</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_customer_import_close"
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
        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <!--begin::Form-->
          <el-form ref="formRef">
            <!--begin::Row-->
            <div class="row fv-row mb-15">
              <el-upload
                class="upload-demo"
                v-model:file-list="fileList"
                :on-change="handleChangeFile"
                drag
                :auto-upload="false"
                :limit="1"
              >
                <inline-svg
                  width="100"
                  height="100"
                  src="media/icons/duotune/files/fil022.svg"
                />
                <!--                <el-icon-->
                <!--                  :size="100"-->
                <!--                  color="#A8ABB1"-->
                <!--                  style="line-height: 0em"-->
                <!--                  class="el-icon&#45;&#45;upload"-->
                <!--                  >-->
                <!--                  <UploadFilled />-->
                <!--                </el-icon>-->
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
              </el-upload>
            </div>
            <!--end::Row-->

            <!--begin::Actions-->
            <!--            <div class="text-center">-->
            <!--              <button-->
            <!--                  type="reset"-->
            <!--                  id="kt_customer_import_cancel"-->
            <!--                  class="btn btn-light me-3"-->
            <!--                  data-bs-dismiss="modal"-->
            <!--              >-->
            <!--                Discard-->
            <!--              </button>-->

            <!--              &lt;!&ndash;begin::Button&ndash;&gt;-->
            <!--              <button-->
            <!--                  :data-kt-indicator="loading ? 'on' : null"-->
            <!--                  type="submit"-->
            <!--                  class="btn btn-lg btn-primary"-->
            <!--              >-->
            <!--                <span v-if="!loading" class="indicator-label">-->
            <!--                  Submit-->
            <!--                  <span class="svg-icon svg-icon-3 ms-2 me-0">-->
            <!--                    <inline-svg src="icons/duotune/arrows/arr064.svg" />-->
            <!--                  </span>-->
            <!--                </span>-->
            <!--                <span v-if="loading" class="indicator-progress">-->
            <!--                  Please wait...-->
            <!--                  <span-->
            <!--                      class="spinner-border spinner-border-sm align-middle ms-2"-->
            <!--                  ></span>-->
            <!--                </span>-->
            <!--              </button>-->
            <!--              &lt;!&ndash;end::Button&ndash;&gt;-->
            <!--            </div>-->
            <!--end::Actions-->
          </el-form>
          <!--end::Form-->
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "import-customer-modal",
  setup() {
    const loading = ref(false);
    const fileList = ref([]);

    const handleChangeFile = (uploadFile) => {
      console.log(uploadFile);
      fileList.value = [];
      fileList.value = [uploadFile];
    };
    return {
      loading,
      fileList,
      handleChangeFile,
    };
  },
});
</script>

<style scoped lang="scss">
:deep(.el-upload-dragger) {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
}
</style>
