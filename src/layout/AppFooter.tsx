import React from "react";

export const AppFooter: React.FC = () => (
  <footer className="border-t border-slate-800 bg-rac-blue-deep py-10 text-center text-slate-300">
    <div className="mx-auto max-w-5xl space-y-2 px-4">
      <p className="text-xs leading-relaxed sm:text-sm">
        งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง
      </p>
      <p className="font-mono text-xs text-slate-500">
        © 2026 Faculty of Environment and Resource Studies, Mahidol University. All rights reserved.
      </p>
    </div>
  </footer>
);

export default AppFooter;
