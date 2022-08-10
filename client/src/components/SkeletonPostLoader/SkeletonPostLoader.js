import React from "react";
import "./skeletonPostLoader.css";
const SkeletonLoader = () => {
  return (
    <section className="card-section">
      <ul className="card-container">
        <li className="card-flex">
          <div className="user-avatar-wrapper">
            <span
              className="skeleton-box"
              style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            />
            <p className="avatar-username">
              <span className="skeleton-box" style={{ width: "55%" }} />
            </p>
          </div>
          <div className="card-body-wrapper">
            <div className="card-body">
              <p>
                <span
                  className="skeleton-box"
                  style={{ width: "95%", height: "300px" }}
                />
                <span
                  className="skeleton-box"
                  style={{ width: "7%", height: "1.2em" }}
                />
                <span
                  className="skeleton-box"
                  style={{ width: "7%", height: "1.2em" }}
                />
                <p>
                  <span className="skeleton-box" style={{ width: "20%" }} />
                </p>
                <p>
                  <span className="skeleton-box" style={{ width: "50%" }} />
                </p>
                <p>
                  <span className="skeleton-box" style={{ width: "30%" }} />
                </p>
                <p>
                  <span className="skeleton-box" style={{ width: "15%" }} />
                </p>
                <p>
                  <span className="skeleton-box" style={{ width: "35%" }} />
                </p>
                <p>
                  <span
                    className="skeleton-box"
                    style={{ width: "95%", height: "2em" }}
                  />
                </p>
                <p>
                  <span className="skeleton-box" style={{ width: "15%" }} />
                </p>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default SkeletonLoader;
