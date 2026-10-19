import React from "react";
import "./styles.scss";

/**
 * The four layout primitives every screen is built from.
 *
 * Deliberately small. Their job is to make the pages consistent without
 * anyone having to remember a class name, not to wrap antd in a second
 * component library -- antd is still used directly for inputs, tables and
 * anything else with real behaviour.
 */

interface PanelProps {
  title: React.ReactNode;
  /** One line under the title. Say what the panel is for, not what it is. */
  hint?: string;
  /** Controls on the right of the header. */
  extra?: React.ReactNode;
  /** Drop the body padding, for a table or list that runs edge to edge. */
  flush?: boolean;
  children: React.ReactNode;
}

export const Panel = ({ title, hint, extra, flush, children }: PanelProps) => (
  <section className="ui--panel">
    <header className="ui--panel--head">
      <div>
        <h3>{title}</h3>
        {hint && <p>{hint}</p>}
      </div>
      {extra && <div className="ui--panel--extra">{extra}</div>}
    </header>
    <div className={`ui--panel--body${flush ? " is-flush" : ""}`}>
      {children}
    </div>
  </section>
);

/** Responsive auto-fit grid. `min` is the narrowest a column may get. */
export const Grid = ({
  min = 260,
  children,
}: {
  min?: number;
  children: React.ReactNode;
}) => (
  <div
    className="ui--grid"
    style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))` }}
  >
    {children}
  </div>
);

type Tone = "default" | "brand" | "success" | "danger";

interface StatProps {
  label: string;
  value: React.ReactNode;
  /** Secondary line: units, context, or why the value is missing. */
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
}

export const Stat = ({ label, value, meta, icon, tone = "default" }: StatProps) => (
  <div className={`ui--stat tone-${tone}`}>
    {icon && <span className="ui--stat--icon">{icon}</span>}
    <span className="ui--stat--text">
      <small>{label}</small>
      <strong>{value}</strong>
      {meta && <em>{meta}</em>}
    </span>
  </div>
);

interface FieldProps {
  label: React.ReactNode;
  /** Monospace the value -- for addresses, hashes and other long hex. */
  mono?: boolean;
  children: React.ReactNode;
}

export const Field = ({ label, mono, children }: FieldProps) => (
  <div className="ui--field">
    <span className="ui--field--label">{label}</span>
    <span className={`ui--field--value${mono ? " is-mono" : ""}`}>
      {children}
    </span>
  </div>
);
