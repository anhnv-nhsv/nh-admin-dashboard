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
        sectionTitle: "banner",
        route: "/banner-management",
        keenthemesIcon: "abstract-43",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "bannerManager",
            route: "/apps/banner-management",
          },
        ],
      },
      {
        sectionTitle: "Pages",
        route: "/page-management",
        keenthemesIcon: "element-equal",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "pageManagement",
            route: "/apps/page-management",
          },
        ],
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
      {
        sectionTitle: "contact",
        route: "/contact",
        keenthemesIcon: "abstract-19",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "Contact Management",
            route: "/apps/contact/category",
          },
        ],
      },
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
        sectionTitle: "user",
        route: "/user-management",
        keenthemesIcon: "people",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "userMgmt",
            route: "/apps/user-management",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
