import type { ReactNode } from 'react';

/** Shared furniture, so eighteen sections stay consistent without repetition. */

export function Section({ id, n, title, lead, children }: { id: string; n: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`}>
      <div className="pb-num">{n}</div>
      <h2 id={`${id}-h`}>{title}</h2>
      {lead ? <p className="pb-lead">{lead}</p> : null}
      {children}
    </section>
  );
}

export function Cards({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="pb-cards auto-grid">
      {items.map((c) => (
        <div className="pb-card" key={c.title}>
          <h4>{c.title}</h4>
          <p>{c.body}</p>
        </div>
      ))}
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="scroll-x">
      <table className="pb-table">
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DoDont({ doTitle = 'Do', dontTitle = 'Don’t', dos, donts }: { doTitle?: string; dontTitle?: string; dos: string[]; donts: string[] }) {
  return (
    <div className="pb-do-dont">
      <div className="pb-do">
        <h4>{doTitle}</h4>
        <ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
      <div className="pb-dont">
        <h4>{dontTitle}</h4>
        <ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </div>
  );
}
