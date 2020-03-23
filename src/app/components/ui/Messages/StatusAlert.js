import React from "react";
import clsx from "clsx";

export default function StatusAlert({ status }) {
  return status && status.message ? (
    <div
      role="alert"
      className={clsx({
        alert: true,
        "alert-danger": status.error,
        "alert-success": status.success,
        "alert-info": !status.success && !status.error,
      })}
    >
      <div className="alert-text">{status.message}</div>
    </div>
  ) : null;
}
