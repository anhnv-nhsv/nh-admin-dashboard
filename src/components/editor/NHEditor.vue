<template>
  <editor style="width: 100%" :init="init" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// TinyMCE
import "tinymce/tinymce";
import "tinymce/icons/default/icons";
import "tinymce/themes/silver/theme";
import "tinymce/models/dom/model";
import "tinymce/skins/ui/oxide/skin.css";
import contentUiCss from "tinymce/skins/ui/oxide/content.css";
import contentCss from "tinymce/skins/content/default/content.css";

// TinyMCE plugins
import "tinymce/plugins/lists/plugin";
import "tinymce/plugins/fullscreen/plugin";
import "tinymce/plugins/emoticons/plugin";
import "tinymce/plugins/link/plugin";
import "tinymce/plugins/wordcount/plugin";
import "tinymce/plugins/image/plugin";
import "tinymce/plugins/table/plugin";
import "tinymce/plugins/anchor/plugin";
import "tinymce/plugins/charmap/plugin";
import "tinymce/plugins/autolink/plugin";
import "tinymce/plugins/media/plugin";
import "tinymce/plugins/quickbars/plugin";
import "tinymce/plugins/importcss/plugin";
import "tinymce/plugins/accordion/plugin";
import "tinymce/plugins/insertdatetime/plugin";
import "tinymce/plugins/advlist/plugin";
import "tinymce/plugins/preview/plugin";
import "tinymce/plugins/pagebreak/plugin";
import "tinymce/plugins/searchreplace/plugin";
import "tinymce/plugins/autoresize/plugin";
import "tinymce/plugins/directionality/plugin";
import "tinymce/plugins/insertdatetime/plugin";
import "tinymce/plugins/wordcount/plugin";

import Editor from "@tinymce/tinymce-vue";
import { getTinymce } from "@tinymce/tinymce-vue/lib/cjs/main/ts/TinyMCE";

export default defineComponent({
  name: "nh-editor",
  props: {
    placeholder: {
      type: String,
      required: false,
      default: () => "Enter content...",
    },
  },
  components: {
    Editor,
  },
  setup(props, ctx) {
    const placeholder = ref(props.placeholder);
    return {
      init: {
        height: 500,
        placeholder: placeholder.value,
        plugins:
          "lists fullscreen link wordcount image table anchor charmap autolink media importcss accordion insertdatetime advlist preview pagebreak searchreplace autoresize directionality insertdatetime",
        toolbar1:
          "undo redo | bold italic underline strikethrough | fontfamily fontsizeinput blocks | alignleft aligncenter alignright alignjustify | numlist bullist | forecolor backcolor | indent outdent",
        toolbar2:
          "table image media link | anchor insertdatetime pagebreak | preview fullscreen",
        skin: false,
        content_css: false,
        content_style: contentUiCss.toString() + "\n" + contentCss.toString(),
        branding: false,
        menubar: false,
        insertdatetime_dateformat: "%d-%m-%Y",
        insertdatetime_formats: [
          "%H:%M:%S",
          "%I:%M:%S %p",
          "%d-%m-%Y",
          "%d/%m/%Y",
        ],
        init_instance_callback: (editor) => {
          document.addEventListener("focusin", (e) => {
            if ((e.target as HTMLElement).closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
              console.log(e);
              e.stopImmediatePropagation();
            }
          });
        },
        image_advtab: true,
        filemanager_crossdomain: true,
        external_filemanager_path:
          "http://172.33.30.19:8010/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1&lang=en_EN&akey=YQv5t_7gG2.gu7b7\-xcoW",
        filemanager_title: "Responsive Filemanager",
        external_plugins: {
          responsivefilemanager:
            "http://172.33.30.19:8010/filemanager/plugin.min.js",
        },
        file_picker_types: "file image media",
        file_picker_callback: (callback, value, meta) => {
          let width = window.innerWidth - 30;
          let height = window.innerHeight - 60;
          if (width > 1800) width = 1800;
          if (height > 1200) height = 1200;
          if (width > 600) {
            const width_reduce = (width - 20) % 138;
            width = width - width_reduce + 10;
          }
          const dialog = getTinymce().activeEditor.windowManager.openUrl({
            title: "Responsive Filemanager",
            url: "http://172.33.30.19:8010/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1&lang=en_EN&akey=YQv5t_7gG2.gu7b7\-xcoW",
            width: width,
            height: height,
          });
          window.addEventListener(
            "message",
            function receiveMessage(event) {
              window.removeEventListener("message", receiveMessage, false);
              if (event.data.sender === "responsivefilemanager") {
                const selectedUrl = event.data.url;
                callback(selectedUrl, { text: selectedUrl });
                dialog.close();
              }
            },
            true
          );
        },
      },
    };
  },
});
</script>

<style scoped lang="scss"></style>
