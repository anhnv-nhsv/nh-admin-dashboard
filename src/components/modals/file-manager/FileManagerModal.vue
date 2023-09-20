<template>
  <div
    class="modal fade"
    id="kt_file_manager_modal"
    ref="fileManagerModalRef"
    aria-hidden="true"
    tabindex="-1"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered mw-1000px mh-100"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">File Manager</h2>
          <div
            class="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>

        <div class="modal-body mx-5 mx-xl-5 my-7">
          <iframe
            ref="fileManagerIframe"
            class="rounded h-500px w-100"
            src="http://172.33.30.19:8010/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1&lang=en_EN&akey=YQv5t_7gG2.gu7b7\-xcoW"
            :allowfullscreen="true"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { hideModal } from "@/core/helpers/dom";

export default {
  name: "file-manager-modal",
  props: {
    isShown: { type: Boolean, default: () => false, required: false },
  },
  setup(props, ctx) {
    const iframeWindow = ref<HTMLIFrameElement | null>(null);
    const fileManagerModalRef = ref<null | HTMLElement>(null);
    const onIframeLoad = () => {
      console.log("onIframeLoad");
      // const iframeWindow = this.$refs.fileManagerIframe.contentWindow;
      if (iframeWindow.value?.contentWindow) {
        iframeWindow.value.addEventListener("message", onMessage);
      }
    };

    const onMessage = (event) => {
      // Handle messages received from the iframe
      if (event.data.sender === "responsivefilemanager") {
        console.log("event: ", event);
        if (event.data.field_id) {
          var fileUrl = event.data.url;

          // Emit a custom event to notify the parent component
          ctx.emit("file-selected", fileUrl);

          // Close modal or perform other actions
          // ...
          // hideModal(fileManagerModalRef.value);
          // ctx.emit("isShown", false);
        }
      }
    };

    // Attach the OnMessage function to the window's message event
    onMounted(() => {
      window.addEventListener("message", onMessage);
    });

    // Detach the event listener when the component is unmounted
    onUnmounted(() => {
      window.removeEventListener("message", onMessage);
    });

    return {
      iframeWindow,
      fileManagerModalRef,
      onIframeLoad,
    };
  },
};
</script>

<style scoped lang="scss"></style>
