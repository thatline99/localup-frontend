interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageLayout = ({ children, title, description, actions }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="p-6 max-w-[1440px] mx-auto">
        {(title || description || actions) && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{title}</h1>
              )}
              {description && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600">{description}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};