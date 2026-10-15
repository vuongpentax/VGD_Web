import type { ReactNode } from "react";

export type StatusStateKind = "loading" | "empty" | "error" | "unavailable";

export function StatusState({
  kind, title, description, eyebrow, icon, className = "", headingLevel = 2, children,
}: {
  kind: StatusStateKind;
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: string;
  className?: string;
  headingLevel?: 2 | 3 | 4;
  children?: ReactNode;
}) {
  const Heading = ("h" + headingLevel) as "h2" | "h3" | "h4";
  const role = kind === "error" ? "alert" : "status";

  return <div className={"status-state status-state-" + kind + (className ? " " + className : "")} role={role} aria-live={kind === "error" ? "assertive" : "polite"}>
    <span className="status-state-icon" aria-hidden="true">{icon ?? (kind === "error" ? "!" : kind === "loading" ? "…" : "↗")}</span>
    <div className="status-state-copy">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Heading className="status-state-title">{title}</Heading>
      {description ? <p className="status-state-description">{description}</p> : null}
    </div>
    {children ? <div className="status-state-actions">{children}</div> : null}
  </div>;
}
