export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "apps",
    route: "/apps",
    pages: [
      {
        heading: "fileManager",
        route: "/apps/file-manager",
        keenthemesIcon: "folder",
        bootstrapIcon: "bi-graph-up",
      },
      {
        heading: "bannerManagement",
        route: "/apps/banner-management",
        keenthemesIcon: "abstract-43",
        bootstrapIcon: "bi-graph-up",
      },
      {
        heading: "pageManagement",
        route: "/apps/page-management",
        keenthemesIcon: "element-equal",
        bootstrapIcon: "bi-graph-up",
      },
      {
        sectionTitle: "news",
        route: "/news",
        keenthemesIcon: "abstract-17",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "newsCategory",
            route: "/apps/news/category",
          },
          {
            heading: "newsList",
            route: "/apps/news/list",
          },
        ],
      },
      // {
      //   heading: "contact",
      //   route: "/apps/contact",
      //   keenthemesIcon: "abstract-19",
      //   bootstrapIcon: "bi-graph-up",
      // },
      {
        sectionTitle: "report",
        route: "/report",
        keenthemesIcon: "cheque",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "reportCategory",
            route: "/apps/report/category",
          },
          {
            heading: "reportList",
            route: "/apps/report/list",
          },
        ],
      },
      {
        heading: "user",
        route: "/apps/user-management",
        keenthemesIcon: "people",
        bootstrapIcon: "bi-graph-up",
      },
      {
        sectionTitle: "settings",
        route: "/apps/settings",
        keenthemesIcon: "setting-4",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "homeMenu",
            route: "/apps/setting/menu-management",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
