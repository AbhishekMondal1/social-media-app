import React from "react";
import "./skeletonPostGridLoader.css";
const SkeletonPostGridLoader = () => {
  return (
    <section className="grid-section">
      <div className="grid-wrapper">
        <div className="flex-grid">
          <span className="skeleton-box boxsize" />
          <span className="skeleton-box boxsize" />
          <span className="skeleton-box boxsize" />
          <span className="skeleton-box boxsize" />
          <span className="skeleton-box boxsize" />
          <span className="skeleton-box boxsize" />
          <span className="skeleton-box boxsize" />
          <span className="skeleton-box boxsize" />
          <span className="skeleton-box boxsize" />
        </div>
      </div>
    </section>
  );
};

export default SkeletonPostGridLoader;
