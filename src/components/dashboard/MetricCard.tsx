import { Card, CardContent } from "@/components/ui";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  subtitle?: string;
  icon?: React.ReactNode;
}

export const MetricCard = ({
  title,
  value,
  change,
  trend,
  subtitle,
  icon,
}: MetricCardProps) => {
  const isPositive = trend === "up";

  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
            <div
              className={`flex items-center gap-2 ${subtitle ? "mt-3" : "mt-2"}`}
            >
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  isPositive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {isPositive ? (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {Math.abs(change)}%
              </span>
              {subtitle && (
                <span className="text-sm text-neutral-500">{subtitle}</span>
              )}
            </div>
          </div>
          {icon && <div className="text-primary-600 opacity-20">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
