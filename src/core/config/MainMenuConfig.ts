const DocMenuConfig = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        svgIcon: "media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
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
        svgIcon: "media/icons/duotune/finance/fin006.svg",
        fontIcon: "bi-printer",
        sub: [
          // {
          //   heading: "gettingStarted",
          //   route: "/apps/customers/getting-started",
          // },
          // {
          //   heading: "customersListing",
          //   route: "/apps/customers/customers-listing",
          // },
          // {
          //   heading: "customerDetails",
          //   route: "/apps/customers/customer-details",
          // },
        ],
      },
    ],
  },
];

export default DocMenuConfig;
