import React from "react";
import { Suspense } from "react";
import { ClimbingBoxLoader } from "react-spinners";
const ProjectLayout = ({ children }) => {
  return (
    <div className=" mx-auto px-10">
      <Suspense
        fallback={
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <ClimbingBoxLoader className="mt-4 " size={25} color="#36d7b7" />
            </div>
          </>
        }
      >
        {children}
      </Suspense>
    </div>
  );
};

export default ProjectLayout;
