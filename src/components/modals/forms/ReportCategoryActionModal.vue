<template>
  <div
    class="modal fade"
    id="kt_report_category_modal"
    ref="reportCateModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-800px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">
            {{ translate("addReportCate") }}
          </h2>
          <h2 class="fw-bolder" v-else>{{ translate("editReportCate") }}</h2>
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
                        >{{ translate("vietnamese") }}</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_2"
                        >{{ translate("english") }}</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_3"
                        >{{ translate("korea") }}</a
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
                    <el-form-item :label="translate('title')" prop="titleVn">
                      <el-input
                        v-model="formData.titleVn"
                        :placeholder="translate('vietnamese')"
                        clearable
                        @input="generateSlug(formData.titleVn)"
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_2" role="tabpanel">
                    <el-form-item :label="translate('title')">
                      <el-input
                        v-model="formData.titleEn"
                        :placeholder="translate('english')"
                        clearable
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_3" role="tabpanel">
                    <el-form-item :label="translate('title')">
                      <el-input
                        v-model="formData.titleKr"
                        :placeholder="translate('korea')"
                        clearable
                      />
                    </el-form-item>
                  </div>
                </div>
                <el-form-item :label="translate('url')">
                  <el-input
                    v-model="formData.url"
                    placeholder="URL"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item :label="translate('publish')">
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
            {{ translate("reset") }}
          </button>
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            @click.prevent="handleRequest(ruleFormRef)"
          >
            <span v-if="!loading" class="indicator-label">
              {{ translate("sure") }}
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
import { translate } from "@/core/helpers/i18n-translate";
import NhForm from "@/components/nh-forms/NHForm.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import type { FormInstance } from "element-plus";
import { useReport } from "@/stores/report";
import qs from "qs";
import { hideModal } from "@/core/helpers/dom";

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
    submitSearch: {
      type: Function,
    },
  },
  components: { NhForm },
  setup(props, ctx) {
    const loading = ref(false);
    const store = useReport();
    const ruleFormRef = ref<FormInstance>();
    const reportCategories = ref([]);
    const idRef = ref();
    const reportCateModalRef = ref<null | HTMLElement>(null);
    const formData = ref({
      titleVn: "",
      titleEn: "",
      titleKr: "",
      url: "/danh-muc-bao-cao/.html",
      publish: true,
    });
    const rules = reactive({
      titleVn: [
        {
          required: true,
          message: translate("titleValidate"),
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
          formData.value.publish = newData.publish === true ? true : false;
          idRef.value = newData.id;
        } else {
          formData.value = {
            titleVn: "",
            titleEn: "",
            titleKr: "",
            url: "/danh-muc-bao-cao/.html",
            publish: true,
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

    const handleRequest = (formEl: FormInstance | undefined) => {
      loading.value = true;
      if (!formEl) return;
      formEl.validate(async (valid, fields) => {
        if (valid) {
          const rawForm = JSON.parse(JSON.stringify(formData.value));
          const dataReq = {
            name: rawForm.titleVn,
            name_english: rawForm.titleEn,
            name_korea: rawForm.titleKr,
            parent_id: 0,
            publish: rawForm.publish === false ? 0 : 1,
            slug: resSlug(rawForm.url),
          };
          if (props.action === "add") {
            const result = await store.createReportCategory(
              qs.stringify(dataReq)
            );
            if (result.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate("addReportSuccessfully"),
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                ctx.emit("on-close");
                ctx.emit("submitSearch");
                hideModal(reportCateModalRef.value);
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
            const result = await store.editReportCategory(
              qs.stringify({ ...dataReq, id: idRef.value })
            );
            if (result.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate("editReportSuccessfully"),
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                ctx.emit("on-close");
                ctx.emit("submitSearch");
                hideModal(reportCateModalRef.value);
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

    const resSlug = (val) => {
      const repoerCateMatch = val.match(/\/danh-muc-bao-cao\/([^/]+)\.html/);

      if (repoerCateMatch) {
        return repoerCateMatch[1];
      } else {
        const htmlMatch = val.match(/([^/]+)\.html$/);
        if (htmlMatch) {
          return htmlMatch[1];
        } else {
          return val;
        }
      }
    };

    return {
      formData,
      ruleFormRef,
      rules,
      loading,
      reportCateModalRef,
      reportCategories,
      handleRequest,
      resetForm,
      generateSlug,
      translate,
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
