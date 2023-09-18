import i18n from "@/core/plugins/i18n";
const { t, te } = i18n.global;

export const translate = (text) => {
  if (te(text)) {
    return t(text);
  } else {
    return text;
  }
};
