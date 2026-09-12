import McPixelCard from "./McPixelCard.vue";

export { McPixelCard };

export default {
  install(app: any) {
    app.component("McPixelCard", McPixelCard);
  },
};
