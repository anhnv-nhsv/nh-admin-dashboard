export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  accessible?: boolean;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}

// const MainMenuConfig: Array<MenuItem> = [
//   {
//     pages: [
//       {
//         heading: "dashboard",
//         route: "/dashboard",
//         keenthemesIcon: "element-11",
//         bootstrapIcon: "bi-app-indicator",
//       },
//     ],
//   },
//   {
//     heading: "apps",
//     route: "/apps",
//     pages: [
//       {
//         heading: "fileManager",
//         route: "/apps/file-manager",
//         keenthemesIcon: "folder",
//         bootstrapIcon: "bi-graph-up",
//       },
//       {
//         heading: "bannerManagement",
//         route: "/apps/banner-management",
//         keenthemesIcon: "abstract-43",
//         bootstrapIcon: "bi-graph-up",
//       },
//       {
//         heading: "pageManagement",
//         route: "/apps/page-management",
//         keenthemesIcon: "element-equal",
//         bootstrapIcon: "bi-graph-up",
//       },
//       {
//         sectionTitle: "news",
//         route: "/news",
//         keenthemesIcon: "abstract-17",
//         bootstrapIcon: "bi-graph-up",
//         sub: [
//           {
//             heading: "newsCategory",
//             route: "/apps/news/category",
//           },
//           {
//             heading: "newsList",
//             route: "/apps/news/list",
//           },
//         ],
//       },
//       // {
//       //   heading: "contact",
//       //   route: "/apps/contact",
//       //   keenthemesIcon: "abstract-19",
//       //   bootstrapIcon: "bi-graph-up",
//       // },
//       {
//         sectionTitle: "report",
//         route: "/report",
//         keenthemesIcon: "cheque",
//         bootstrapIcon: "bi-graph-up",
//         sub: [
//           {
//             heading: "reportCategory",
//             route: "/apps/report/category",
//           },
//           {
//             heading: "reportList",
//             route: "/apps/report/list",
//           },
//         ],
//       },
//       {
//         heading: "user",
//         route: "/apps/user-management",
//         keenthemesIcon: "people",
//         bootstrapIcon: "bi-graph-up",
//       },
//     ],
//   },
// ];
// export const MainMenuConfig: Array<MenuItem> = [
//   {
//     pages: [
//       {
//         heading: "dashboard",
//         route: "/dashboard",
//         keenthemesIcon: "element-11",
//         bootstrapIcon: "bi-app-indicator",
//       },
//     ],
//   },
//   {
//     heading: "apps",
//     route: "/apps",
//     pages: [
//       {
//         heading: "fileManager",
//         route: "/apps/file-manager",
//         keenthemesIcon: "folder",
//         bootstrapIcon: "bi-graph-up",
//       },
//       {
//         heading: "bannerManagement",
//         route: "/apps/banner-management",
//         keenthemesIcon: "abstract-43",
//         bootstrapIcon: "bi-graph-up",
//       },
//       {
//         heading: "pageManagement",
//         route: "/apps/page-management",
//         keenthemesIcon: "element-equal",
//         bootstrapIcon: "bi-graph-up",
//       },
//       {
//         sectionTitle: "news",
//         route: "/news",
//         keenthemesIcon: "abstract-17",
//         bootstrapIcon: "bi-graph-up",
//         sub: [
//           {
//             heading: "newsCategory",
//             route: "/apps/news/category",
//           },
//           {
//             heading: "newsList",
//             route: "/apps/news/list",
//           },
//         ],
//       },
//       // {
//       //   heading: "contact",
//       //   route: "/apps/contact",
//       //   keenthemesIcon: "abstract-19",
//       //   bootstrapIcon: "bi-graph-up",
//       // },
//       {
//         sectionTitle: "report",
//         route: "/report",
//         keenthemesIcon: "cheque",
//         bootstrapIcon: "bi-graph-up",
//         sub: [
//           {
//             heading: "reportCategory",
//             route: "/apps/report/category",
//           },
//           {
//             heading: "reportList",
//             route: "/apps/report/list",
//           },
//         ],
//       },
//       {
//         heading: "user",
//         route: "/apps/user-management",
//         keenthemesIcon: "people",
//         bootstrapIcon: "bi-graph-up",
//       },
//       {
//         sectionTitle: "setting",
//         route: "/setting",
//         keenthemesIcon: "setting-2",
//         bootstrapIcon: "bi-graph-up",
//         sub: [
//           {
//             heading: "Menu",
//             route: "/apps/setting/menu",
//           },
//           // {
//           //   heading: "Display",
//           //   route: "/apps/setting/display",
//           // },
//           // {
//           //   heading: "Setting",
//           //   route: "/apps/setting/custom",
//           // },
//         ],
//       },
//     ],
//   },
// ];

export const getMainMenu = (role): Array<MenuItem> => {
  return [
    {
      accessible: true,
      pages: [
        {
          heading: "dashboard",
          route: "/dashboard",
          accessible: true,
          keenthemesIcon: "element-11",
          bootstrapIcon: "bi-app-indicator",
        },
      ],
    },
    {
      heading: "apps",
      route: "/apps",
      accessible: true,
      pages: [
        {
          heading: "fileManager",
          route: "/apps/file-manager",
          accessible: "file_manager" in role.grantedPermissions,
          keenthemesIcon: "folder",
          bootstrapIcon: "bi-graph-up",
        },
        {
          heading: "bannerManagement",
          route: "/apps/banner-management",
          accessible: "banner" in role.grantedPermissions,
          keenthemesIcon: "abstract-43",
          bootstrapIcon: "bi-graph-up",
        },
        {
          heading: "pageManagement",
          route: "/apps/page-management",
          accessible: "pages" in role.grantedPermissions,
          keenthemesIcon: "element-equal",
          bootstrapIcon: "bi-graph-up",
        },
        {
          sectionTitle: "news",
          route: "/news",
          accessible: "news" in role.grantedPermissions,
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
          accessible: "report" in role.grantedPermissions,
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
          accessible: "user" in role.grantedPermissions,
          keenthemesIcon: "people",
          bootstrapIcon: "bi-graph-up",
        },
        {
          sectionTitle: "setting",
          route: "/setting",
          accessible: "setting" in role.grantedPermissions,
          keenthemesIcon: "setting-2",
          bootstrapIcon: "bi-graph-up",
          sub: [
            {
              heading: "Menu",
              route: "/apps/setting/menu",
            },
            // {
            //   heading: "Display",
            //   route: "/apps/setting/display",
            // },
            // {
            //   heading: "Setting",
            //   route: "/apps/setting/custom",
            // },
          ],
        },
      ],
    },
  ];
};

export default { getMainMenu };
