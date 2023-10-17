<template>
  <div
    class="modal fade"
    id="kt_report_modal"
    ref="reportModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered mw-75"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">
            {{ translate("addReport") }}
          </h2>
          <h2 class="fw-bolder" v-else>{{ translate("editReport") }}</h2>
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
              <el-form
                ref="ruleFormRef"
                :model="formData"
                label-width="160px"
                class="demo-ruleForm"
                status-icon
                :size="formSize"
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
                    <el-form-item
                      :label="translate('content')"
                      prop="contentVn"
                    >
                      <NhEditor
                        v-model="formData.contentVn"
                        :placeholder="translate('vietnamese')"
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
                    <el-form-item :label="translate('content')">
                      <NhEditor
                        v-model="formData.contentEn"
                        :placeholder="translate('english')"
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
                    <el-form-item :label="translate('content')">
                      <NhEditor
                        v-model="formData.contentKr"
                        :placeholder="translate('korea')"
                      />
                    </el-form-item>
                  </div>
                </div>
                <el-form-item
                  :label="translate('newsSection')"
                  prop="parentCategory"
                >
                  <el-cascader
                    v-model="formData.parentCategory"
                    :options="parents"
                    :teleported="false"
                    :props="cascaderConfig"
                    clearable
                    filterable
                    style="width: 100%"
                    @change="handleChangeReport"
                  />
                </el-form-item>
                <el-form-item :label="translate('image')" prop="imageUrl">
                  <el-input
                    v-model="formData.image"
                    :placeholder="translate('image')"
                    clearable
                    disabled
                  >
                    <template #prepend>
                      <el-button type="primary" @click.prevent="chooseImage"
                        >{{ translate("chooseFile") }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item
                  :label="translate('postingTime')"
                  prop="date_report"
                >
                  <div class="demo-datetime-picker" style="width: 100%">
                    <div class="block">
                      <el-date-picker
                        v-model="formData.date_report"
                        type="date"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        :teleported="false"
                        :editable="false"
                        :placeholder="translate('reportDate')"
                      />
                    </div>
                  </div>
                </el-form-item>
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
            id="kt_modal_test_editor_cancel"
            class="btn btn-light me-3"
            data-bs-dismiss="modal"
          >
            {{ translate("discard") }}
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
import { defineComponent, reactive, ref, watch } from "vue";
import { translate } from "@/core/helpers/i18n-translate";
import NhForm from "@/components/nh-forms/NHForm.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import type { FormInstance } from "element-plus";
import { useReport } from "@/stores/report";
import NhEditor from "@/components/editor/NHEditor.vue";
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
    reportCategories: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  components: { NhForm, NhEditor },
  setup(props, ctx) {
    const loading = ref(false);
    const store = useReport();
    const ruleFormRef = ref<FormInstance>();
    const cateID = ref();
    const idRef = ref();
    const idSelect = ref();
    const parents = ref();
    const reportModalRef = ref<null | HTMLElement>(null);
    const formSize = ref("default");
    const formData = ref({
      titleVn: "",
      titleEn: "",
      titleKr: "",
      contentVn: "",
      contentEn: "",
      contentKr: "",
      parentCategory: "",
      image: "",
      image_english: "",
      image_korea: "",
      date_report: "",
      url: "/bao-cao/.html",
      publish: false,
    });
    const rules = reactive({
      titleVn: [
        {
          required: true,
          message: translate("titleValidate"),
          trigger: "blur",
        },
      ],
      date_report: [
        {
          required: true,
          message: translate("dateReportVal"),
          trigger: "change",
        },
      ],
      parentCategory: [
        {
          required: true,
          message: translate("parentCategoryValidate"),
          trigger: "change",
        },
      ],
      contentVn: [
        {
          required: true,
          message: translate("contentValidate"),
          trigger: "change",
        },
      ],
      contentEn: [
        {
          required: true,
          message: translate("contentValidate"),
          trigger: "change",
        },
      ],
      contentKr: [
        {
          required: true,
          message: translate("contentValidate"),
          trigger: "change",
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
          formData.value.contentVn = newData.contentVn;
          formData.value.contentEn = newData.contentEn;
          formData.value.contentKr = newData.contentKr;
          formData.value.date_report = formatDate(newData.date_report);
          formData.value.parentCategory = newData.category_id;
          cateID.value = newData.category_id;
          formData.value.url = newData.url;
          formData.value.publish = newData.publish === true ? true : false;
          idRef.value = newData.id;
        } else {
          formData.value = {
            titleVn: "",
            titleEn: "",
            titleKr: "",
            contentVn: "",
            contentEn: "",
            contentKr: "",
            parentCategory: "",
            image: "",
            image_english: "",
            image_korea: "",
            date_report: "",
            url: "/bao-cao/.html",
            publish: true,
          };
        }
      }
    );

    watch(
      () => props.reportCategories,
      (newVal) => {
        parents.value = buildHierarchy(newVal);
      }
    );

    function buildHierarchy(arr) {
      const hierarchy: any = [];
      // Create a map of id to item and initialize children
      for (const item of arr) {
        item.value = item.name;
        item.label = item.name;
        hierarchy.push(item);
      }

      return hierarchy;
    }

    const generateSlug = (title) => {
      formData.value.url = "/bao-cao/" + toSlug(title) + ".html";
    };

    const cascaderConfig = {
      expandTrigger: "hover" as const,
      value: "id",
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
            parent_id: idSelect.value || cateID.value,
            category_id: idSelect.value || cateID.value,
            image: rawForm.image,
            content: rawForm.contentVn,
            content_english: rawForm.contentEn,
            content_korea: rawForm.contentKr,
            status: "Noi-bat",
            publish: rawForm.publish === false ? 0 : 1,
            slug: resSlug(rawForm.url),
            date_report: rawForm.date_report,
          };
          if (props.action === "add") {
            const result = await store.createReport(qs.stringify(dataReq));
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
                hideModal(reportModalRef.value);
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
            const result = await store.editReport(
              qs.stringify({
                ...dataReq,
                id: idRef.value,
              })
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
                hideModal(reportModalRef.value);
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

    const handleChangeReport = (value) => {
      const res = JSON.parse(JSON.stringify(value));
      if (res) {
        idSelect.value = res.toString();
      } else {
        idSelect.value = "";
      }
    };

    const chooseImage = () => {
      window.addEventListener("message", handleMessage);
      Swal.fire({
        width: "80%",
        heightAuto: false,
        /* eslint-disable no-useless-escape */
        html: `<iframe
                    ref="fileManagerIframe"
                    class="rounded h-600px w-100"
                    src="http://172.33.30.19:8010/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1&lang=en_EN&akey=YQv5t_7gG2.gu7b7\-xcoW"
                    :allowfullscreen="true"
               ></iframe>`,
        closeButtonAriaLabel: "Close file manager",
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
          htmlContainer: "rfm-height-100",
        },
      });
    };

    const handleMessage = (event) => {
      if (event.data.sender === "responsivefilemanager") {
        if (event.data.field_id) {
          formData.value.image = event.data.url;
          Swal.close();
          // Delete handler of the message from ResponsiveFilemanager
          window.removeEventListener("message", handleMessage);
        }
      }
    };

    const resSlug = (val) => {
      const repoerCateMatch = val.match(/\/bao-cao\/([^/]+)\.html/);

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

    const formatDate = (val) => {
      const date = new Date(val);
      const dateObject = new Date(date);

      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");

      const desiredDateString = `${year}-${month}-${day}`;

      return desiredDateString;
    };

    return {
      formData,
      parents,
      ruleFormRef,
      rules,
      loading,
      reportModalRef,
      formSize,
      cascaderConfig,
      handleChangeReport,
      chooseImage,
      handleRequest,
      resetForm,
      generateSlug,
      formatDate,
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
