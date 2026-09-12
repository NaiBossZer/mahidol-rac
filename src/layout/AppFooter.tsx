import React from "react";
import { useTranslation } from "react-i18next";

export const AppFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-800 bg-rac-blue-deep py-10 text-center text-slate-300">
      <div className="mx-auto max-w-5xl space-y-2 px-4">
        <p className="text-xs leading-relaxed sm:text-sm">{t("footer.location")}</p>
        <p className="font-mono text-xs text-slate-500">{t("footer.rights")}</p>
      </div>
    </footer>
  );
};

export default AppFooter;
