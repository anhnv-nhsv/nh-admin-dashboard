import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/apps/customers/customer-score-list",
        name: "apps-customer-score-list",
        component: () => import("@/views/apps/customers/CustomerScoreList.vue"),
        meta: {
          pageTitle: "Customers Score",
          breadcrumbs: ["Apps", "Customers Score"],
        },
      },
      {
        path: "/apps/statistics/request-statistics",
        name: "apps-request-statistics",
        component: () =>
          import("@/views/apps/statistics/RequestStatistics.vue"),
        meta: {
          pageTitle: "Request Statistics",
          breadcrumbs: ["Apps", "Request Statistics"],
        },
      },
      {
        path: "/apps/page-management",
        name: "apps-page-management",
        component: () =>
          import("@/views/apps/page-management/PageManagement.vue"),
        meta: {
          pageTitle: "Page Management",
          breadcrumbs: ["Apps", "Page Management"],
        },
      },
      {
        path: "/apps/news/category",
        name: "news-category",
        component: () => import("@/views/apps/news/NewsCategories.vue"),
        meta: {
          pageTitle: "News Categories",
          breadcrumbs: ["News", "News Categories"],
        },
      },
      {
        path: "/apps/news/list",
        name: "news-listing",
        component: () => import("@/views/apps/news/NewsListing.vue"),
        meta: {
          pageTitle: "News List",
          breadcrumbs: ["News", "News List"],
        },
      },
      {
        path: "/apps/banner-management",
        name: "apps-banner-management",
        component: () => import("@/views/apps/banner/Banner.vue"),
        meta: {
          pageTitle: "Banner Management",
          breadcrumbs: ["Apps", "Banner Management"],
        },
      },
      {
        path: "/apps/banner-management/create",
        name: "create-banner",
        component: () =>
          import("@/views/apps/banner/components/CreateBanner.vue"),
        meta: {
          pageTitle: "Create Banner",
          breadcrumbs: ["Apps", "Banner Management", "Create"],
        },
      },
      {
        path: "/apps/banner-management/:id/edit",
        name: "editBanner",
        component: () =>
          import("@/views/apps/banner/components/EditBanner.vue"),
        meta: {
          pageTitle: "Edit Banner",
          breadcrumbs: ["Apps", "Banner Management", "Edit"],
        },
      },
      {
        path: "/apps/news-management",
        name: "apps-news-management",
        component: () => import("@/views/apps/news/News.vue"),
        meta: {
          pageTitle: "News Management",
          breadcrumbs: ["Apps", "News Management"],
        },
      },
      {
        path: "/apps/contact",
        name: "apps-contact",
        component: () => import("@/views/apps/contact/Contact.vue"),
        meta: {
          pageTitle: "Contact Management",
          breadcrumbs: ["Apps", "Contact Management"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/multi-step-sign-up",
    name: "multi-step-sign-up",
    component: () =>
      import("@/views/crafted/authentication/MultiStepSignUp.vue"),
    meta: {
      pageTitle: "Multi-step Sign up",
    },
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
