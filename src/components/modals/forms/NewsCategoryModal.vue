<template>
  <div
    class="modal fade"
    id="kt_news_category_modal"
    ref="newsCategoryModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered mw-1000px"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">
            {{ translate("addNewsCate") }}
          </h2>
          <h2 class="fw-bolder" v-else>{{ translate("editNewsCate") }}</h2>
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
                :model="pageForm"
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
                    <el-form-item :label="translate('title')" prop="name">
                      <el-input
                        v-model="pageForm.name"
                        :placeholder="translate('vietnamese')"
                        clearable
                        @input="generateSlug(pageForm.name)"
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_2" role="tabpanel">
                    <el-form-item :label="translate('title')">
                      <el-input
                        v-model="pageForm.name_english"
                        :placeholder="translate('english')"
                        clearable
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_3" role="tabpanel">
                    <el-form-item :label="translate('title')">
                      <el-input
                        v-model="pageForm.name_korea"
                        :placeholder="translate('korea')"
                        clearable
                      />
                    </el-form-item>
                  </div>
                </div>
                <el-form-item :label="translate('url')">
                  <el-input
                    v-model="pageForm.url"
                    :placeholder="translate('url')"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item :label="translate('publish')">
                  <el-switch v-model="pageForm.publish" />
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
            v-if="action === 'add'"
            @click="handleAdd(ruleFormRef)"
          >
            <span v-if="true" class="indicator-label">
              {{ translate("addBtn") }}
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
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            v-if="action === 'edit'"
            @click="handleEdit(ruleFormRef)"
          >
            <span v-if="true" class="indicator-label">
              {{ translate("editBtn") }}
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
import { defineComponent, reactive, ref, watch } from "vue";
import NhForm from "@/components/nh-forms/NHForm.vue";
import { translate } from "@/core/helpers/i18n-translate";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { FormInstance, UploadInstance } from "element-plus";
import { useNewsStore } from "@/stores/news-category";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { hideModal } from "@/core/helpers/dom";

export default defineComponent({
  name: "page-category-modal",
  props: {
    action: { type: String, default: () => "add", required: false },
    rowDetail: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    abc: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    submitSearch: {
      type: Function,
    },
  },
  components: { NhForm },
  setup: function (props, ctx) {
    const store = useNewsStore();
    const detailData = ref(props.rowDetail);
    const getAllRes = ref(props.abc);
    const publish = ref();
    const typePost = ref();
    const categoryId = ref();
    const parentId = ref();
    const idRow = ref();
    const rowValue = ref(JSON.parse(JSON.stringify(detailData.value)));
    const qwe = ref(JSON.parse(JSON.stringify(getAllRes.value)));
    const parents = ref();
    const idSelect = ref();
    const formSize = ref("default");
    const ruleFormRef = ref<FormInstance>();
    const newsCategoryModalRef = ref<null | HTMLElement>(null);
    const rules = reactive({
      name: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "blur",
        },
      ],
    });

    let pageForm = ref({
      name: "",
      name_english: "",
      name_korea: "",
      slug: "",
      url: "/chuyen-muc-tin/.html",
      publish: true,
    });

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

    watch(
      () => props.rowDetail,
      (newVal) => {
        if (Object.keys(newVal).length !== 0 && newVal.constructor === Object) {
          rowValue.value = newVal;
          pageForm.value.name = rowValue.value.name;
          pageForm.value.name_english = rowValue.value.name_english;
          pageForm.value.name_korea = rowValue.value.name_korea;
          pageForm.value.slug = rowValue.value.slug;
          pageForm.value.url =
            "/chuyen-muc-tin/" + toSlug(rowValue.value.name) + ".html";
          pageForm.value.publish = rowValue.value.publish === 0 ? false : true;
          publish.value = rowValue.value.publish;
          typePost.value = rowValue.value.type_post;
          categoryId.value = rowValue.value.category_id;
          parentId.value = rowValue.value.parent_id;
          idRow.value = rowValue.value.id;
        } else {
          pageForm.value = {
            name: "",
            name_english: "",
            name_korea: "",
            slug: "",
            url: "/chuyen-muc-tin/.html",
            publish: true,
          };
        }
      }
    );

    watch(
      () => props.abc,
      (newVal) => {
        parents.value = buildHierarchy(newVal.data);
      }
    );

    const cascaderConfig = {
      expandTrigger: "hover" as const,
      checkStrictly: true,
      value: "id",
    };

    const handleAdd = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const formData = JSON.parse(JSON.stringify(pageForm.value));
          const result = await store.createNewsCategory({
            ...formData,
            type_post: "page",
            parent_id: 0,
            slug: resSlug(formData.url),
            publish: formData.publish === false ? 0 : 1,
          });
          if (result.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("addNewsSuccessfully"),
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: result.data.mess,
              showConfirmButton: false,
              timer: 1500,
            });
          }
          ctx.emit("submitSearch");
          hideModal(newsCategoryModalRef.value);
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const handleEdit = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const formData = JSON.parse(JSON.stringify(pageForm.value));
          const result = await store.editNewsCategory({
            ...formData,
            type_post: typePost.value,
            parent_id: 0,
            publish: formData.publish === false ? 0 : 1,
            id: idRow.value,
            slug: resSlug(formData.url),
          });
          if (result.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("editNewsSuccessfully"),
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: result.data.mess,
              showConfirmButton: false,
              timer: 1500,
            });
          }
          ctx.emit("submitSearch");
          hideModal(newsCategoryModalRef.value);
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);
    const uploadRef = ref<UploadInstance>();
    const fileList = ref<any>([]);

    const handleChangeCategory = (value) => {
      const temp = JSON.parse(JSON.stringify(value));
      const a = temp[temp.length - 1];

      idSelect.value = a.toString();
    };

    const generateSlug = (title) => {
      pageForm.value.url = "/chuyen-muc-tin/" + toSlug(title) + ".html";
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

    const resSlug = (val) => {
      const newsMatch = val.match(/\/chuyen-muc-tin\/([^/]+)\.html/);

      if (newsMatch) {
        return newsMatch[1];
      } else {
        const htmlMatch = val.match(/([^/]+)\.html$/);
        if (htmlMatch) {
          return htmlMatch[1];
        } else {
          return val;
        }
      }
    };

    const handleSave = () => {};

    return {
      cascaderConfig,
      handleSave,
      pageForm,
      Delete,
      Plus,
      ZoomIn,
      dialogImageUrl,
      parents,
      dialogVisible,
      uploadRef,
      fileList,
      rowValue,
      qwe,
      rules,
      formSize,
      ruleFormRef,
      newsCategoryModalRef,
      handleChangeCategory,
      handleAdd,
      generateSlug,
      handleEdit,
      translate,
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
