interface PlaceholderProps {
  icon?: React.JSX.Element;
  title: string;
  description?: string;
}

export default function Placeholder({ icon, title, description }: PlaceholderProps) {
  return (
    <div className="placeholder flex p-4 bg-primary-foreground rounded-md gap-4 items-center">
      {icon && <div className="placeholder-icon">{icon}</div>}

      <div className="placeholder-info flex flex-col">
        <div className="title text-lg">{title}</div>
        {description && <div className="title text-muted-foreground">{description}</div>}
      </div>
    </div>
  );
}
