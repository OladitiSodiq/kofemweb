import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { u as useAdminReport, A as AdminHeaderReport, V as VisitorsReportCharts } from "./admin-routes-8cfb6ea5.mjs";
import { U as StaticPageTitle, T as Trans } from "../server-entry.mjs";
import { a7 as DateRangePresets, a8 as ReportDateSelector } from "./dashboard-routes-d9f67ead.mjs";
import "react-router-dom";
import "clsx";
import "./Edit-18dc9207.mjs";
import "@react-aria/utils";
import "react-hook-form";
import "@tanstack/react-query";
import "zustand";
import "zustand/middleware";
import "zustand/middleware/immer";
import "deepmerge";
import "@react-stately/utils";
import "immer";
import "framer-motion";
import "nanoid";
import "deep-object-diff";
import "dot-object";
import "@react-stately/color";
import "nano-memoize";
import "@tanstack/react-virtual";
import "./use-resume-subscription-d02f5f4b.mjs";
import "react-dom/server";
import "process";
import "http";
import "axios";
import "react-router-dom/server.mjs";
import "@internationalized/date";
import "@internationalized/number";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "@react-aria/focus";
import "react-dom";
import "@react-aria/ssr";
import "url-regex";
import "react-use-clipboard";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "get-video-id";
import "@react-aria/interactions";
import "slugify";
import "react-colorful";
function AdminReportPage() {
  const [dateRange, setDateRange] = useState(() => {
    return DateRangePresets[2].getRangeValue();
  });
  const { isLoading, data } = useAdminReport({ dateRange });
  const title = /* @__PURE__ */ jsx(Trans, { message: "Visitors report" });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full gap-12 overflow-x-hidden p-12 md:gap-24 md:p-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-24 items-center justify-between gap-24 md:flex", children: [
      /* @__PURE__ */ jsx(StaticPageTitle, { children: title }),
      /* @__PURE__ */ jsx("h1", { className: "mb-24 text-3xl font-light md:mb-0", children: title }),
      /* @__PURE__ */ jsx(ReportDateSelector, { value: dateRange, onChange: setDateRange })
    ] }),
    /* @__PURE__ */ jsx(AdminHeaderReport, { report: data == null ? void 0 : data.headerReport }),
    /* @__PURE__ */ jsx(
      VisitorsReportCharts,
      {
        report: data == null ? void 0 : data.visitorsReport,
        isLoading
      }
    )
  ] });
}
export {
  AdminReportPage as default
};
//# sourceMappingURL=admin-report-page-e3fcf81f.mjs.map
