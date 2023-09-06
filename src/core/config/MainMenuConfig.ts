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
        sectionTitle: "customers",
        route: "/customers",
        keenthemesIcon: "user",
        bootstrapIcon: "bi-people",
        sub: [
          {
            heading: "customerScoreListing",
            route: "/apps/customers/customer-score-list",
          },
        ],
      },
      {
        sectionTitle: "statistics",
        route: "/statistics",
        keenthemesIcon: "abstract-45",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "requestStatistics",
            route: "/apps/statistics/request-statistics",
          },
        ],
      },

      {
        sectionTitle: "Banner",
        route: "/banner-management",
        keenthemesIcon: "abstract-43",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "Banner Management",
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
    ],
  },
];

export default MainMenuConfig;
