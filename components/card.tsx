'use client';


interface CardProps {
  children?: React.ReactNode;
  caption: string;
  title: string;
  description?: string;
  actions?: React.JSX.Element[];
}

export function Card({ children, caption, title, description, actions }: CardProps) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="card-header flex items-center justify-between bg-primary-foreground p-4 rounded-md hover:bg-secondary/80 transition-colors">
        <div className="card-info flex flex-col">
          <div className="card-type text-muted-foreground text-xs uppercase">{caption}</div>
          <div className="card-title text-xl font-bold">{title}</div>
          {description && <div className="card-description text-muted-foreground">{description}</div>}
        </div>

        {actions && <div className="card-actions flex gap-2">{actions.map((action) => action)}</div>}
      </div>

      {children && <div className="card-content space-y-4">{children}</div>}
    </div>
  );
}