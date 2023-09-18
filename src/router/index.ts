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
      // FILE MANAGER START
      {
        path: "/apps/file-manager",
        name: "apps-file-manager",
        component: () => import("@/views/apps/file-manager/FileManager.vue"),
        meta: {
          pageTitle: "File Manager",
          // breadcrumbs: ["Apps", "File Manager"],
        },
      },
      // FILE MANAGER END
      // PAGE START
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
      // PAGE END

      // NEWS START
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
      // NEWS END

      // REPORT START
      {
        path: "/apps/report/category",
        name: "report-category",
        component: () => import("@/views/apps/report/ReportCategory.vue"),
        meta: {
          pageTitle: "Report Categories",
          breadcrumbs: ["Report", "Report Categories"],
        },
      },
      {
        path: "/apps/report/list",
        name: "report-list",
        component: () => import("@/views/apps/report/ReportList.vue"),
        meta: {
          pageTitle: "Report List",
          breadcrumbs: ["Report", "Report List"],
        },
      },
      // REPORT END

      // CONTACT START
      {
        path: "/apps/contact/category",
        name: "contact-category",
        component: () => import("@/views/apps/contact/Contact.vue"),
        meta: {
          pageTitle: "Contact Category",
          breadcrumbs: ["Contact", "Contact Categories"],
        },
      },
      // CONTACT END

      // BANNER START
      {
        path: "/apps/banner-management",
        name: "apps-banner-management",
        component: () => import("@/views/apps/banner/Banner.vue"),
        meta: {
          pageTitle: "Banner Management",
          breadcrumbs: ["Apps", "Banner Management"],
        },
      },
      // BANNER END

      // USER START
      {
        path: "/apps/user-management",
        name: "apps-user-management",
        component: () => import("@/views/apps/user/UserMgmt.vue"),
        meta: {
          pageTitle: "User Management",
          breadcrumbs: ["Apps", "User Management"],
        },
      },
      // USER END
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
  // authStore.verifyAuth();

  // before page access check if page requires authentication
  next();
  // if (to.meta.middleware == "auth") {
  //   if (authStore.isAuthenticated) {
  //     next();
  //   } else {
  //     next({ name: "sign-in" });
  //   }
  // } else {
  //   next();
  // }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
