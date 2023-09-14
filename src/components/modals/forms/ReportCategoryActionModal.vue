<template>
  <div
    class="modal fade"
    id="kt_report_category_modal"
    ref="bannerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-800px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">Add Report Category</h2>
          <h2 class="fw-bolder" v-else>Edit Report Category</h2>
          <div
            id="kt_report_category_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body scroll-y mx-5 mx-xl-5">
          <NhForm seoable>
            <template v-slot:customForm>
              <el-form
                ref="ruleFormRef"
                :model="formData"
                label-width="160px"
                class="demo-ruleForm"
                status-icon
                :rules="rules"
              >
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
                    <el-form-item label="Tiêu đề" prop="titleVn">
                      <el-input
                        v-model="formData.titleVn"
                        placeholder="Tiếng Việt"
                        clearable
                        @input="generateSlug(formData.titleVn)"
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_2" role="tabpanel">
                    <el-form-item label="Tiêu đề">
                      <el-input
                        v-model="formData.titleEn"
                        placeholder="Tiếng Anh"
                        clearable
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_3" role="tabpanel">
                    <el-form-item label="Tiêu đề">
                      <el-input
                        v-model="formData.titleKr"
                        placeholder="Tiếng Hàn"
                        clearable
                      />
                    </el-form-item>
                  </div>
                </div>
                <el-form-item label="URL">
                  <el-input
                    v-model="formData.url"
                    placeholder="URL"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="Publish">
                  <el-switch v-model="formData.publish" />
                </el-form-item>
              </el-form>
            </template>
          </NhForm>
        </div>
        <div class="modal-footer">
          <button
            type="reset"
            id="kt_report_category_cancel"
            class="btn btn-light me-3"
            @click.prevent="resetForm(ruleFormRef)"
          >
            Reset
          </button>
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            @click.prevent="handleRequest(ruleFormRef)"
          >
            <span v-if="!loading" class="indicator-label">
              Submit
              <span class="svg-icon svg-icon-3 ms-2 me-0">
                <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
              </span>
            </span>
            <span v-if="loading" class="indicator-progress">
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
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import NhForm from "@/components/nh-forms/NHForm.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import type { FormInstance } from "element-plus";
import { useBanner } from "@/stores/banner";
import qs from "qs";
import { hideModal } from "@/core/helpers/dom";
import { useReport } from "@/stores/report";

export default defineComponent({
  name: "report-category-action-modal",
  props: {
    action: { type: String, default: () => "add", required: false },
    data: {
      type: Object,
      default: () => {
        return {};
      },
      required: true,
    },
  },
  components: { NhForm },
  setup(props, ctx) {
    const loading = ref(false);
    const store = useReport();
    const ruleFormRef = ref<FormInstance>();
    const reportCategories = ref([]);
    const bannerModalRef = ref<null | HTMLElement>(null);
    const formData = ref({
      titleVn: "",
      titleEn: "",
      titleKr: "",
      url: "/danh-muc-bao-cao/.html",
      publish: false,
    });
    const rules = reactive({
      titleVn: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "blur",
        },
      ],
    });

    watch(
      () => props.data,
      (newVal) => {
        if (Object.keys(newVal).length !== 0 && newVal.constructor === Object) {
          const newData = JSON.parse(JSON.stringify(newVal));
          formData.value.titleVn = newData.titleVn;
          formData.value.titleEn = newData.titleEn;
          formData.value.titleKr = newData.titleKr;
          formData.value.url = newData.url;
          formData.value.publish = newData.publish;
        } else {
          formData.value = {
            titleVn: "",
            titleEn: "",
            titleKr: "",
            url: "/danh-muc-bao-cao/.html",
            publish: false,
          };
        }
      }
    );

    onMounted(async () => {
      await store.getAllReportCategory({
        params: {
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestCategoryResponse = JSON.parse(
        JSON.stringify(store.reportCategoryList)
      );
      reportCategories.value = requestCategoryResponse.data;
    });

    const generateSlug = (title) => {
      formData.value.url = "/danh-muc-bao-cao/" + toSlug(title) + ".html";
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

    const handleRequest = (formEl: FormInstance | undefined) => {
      loading.value = true;
      if (!formEl) return;
      formEl.validate(async (valid, fields) => {
        if (valid) {
          const rawForm = JSON.parse(JSON.stringify(formData.value));
          const formData = {
            id: rawForm.id,
            name: rawForm.titleVn,
            content: rawForm.content,
            publish: rawForm.isPublish ? 1 : 0,
            link: rawForm.attachUrl,
            image: rawForm.imageUrl,
          };
          if (props.action === "add") {
            const result = await store.createBanner(qs.stringify(formData));
            if (result.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Tạo banner thành công!",
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                ctx.emit("on-close");
                hideModal(bannerModalRef.value);
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: result.data.mess,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          } else {
            const result = await store.editBanner(qs.stringify(formData));
            if (result.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Cập nhật banner thành công!",
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                ctx.emit("on-close");
                hideModal(bannerModalRef.value);
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: result.data.mess,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          }
        } else {
          console.log("error submit!", fields);
        }
      });
      loading.value = false;
    };

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    return {
      formData,
      ruleFormRef,
      rules,
      loading,
      bannerModalRef,
      reportCategories,
      handleRequest,
      resetForm,
      generateSlug,
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
