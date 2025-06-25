import NextLink, {LinkProps as NextLinkProps} from "next/link";

interface SummaryCardProps {
  href: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  bg?: string;  // background color or gradient
}

export default function SummaryCard({
  href,
  title,
  value,
  icon,
  className = '',
  bg = 'bg-white',  // default background
}: SummaryCardProps) {
  return (
    <NextLink
      href={href}
      className={`rounded-2xl shadow-xl p-8 min-h-48 flex items-center space-x-6
                  transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl
                  ${bg} ${className}`}
    >
      {icon && (
        <div className="text-5xl text-blue-700">
          {icon}
        </div>
      )}
      <div>
        <div className="text-lg font-semibold text-gray-700">{title}</div>
        <div className="text-4xl font-extrabold text-blue-800">{value}</div>
      </div>
    </NextLink>
  );
}