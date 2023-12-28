import {ReactNode} from 'react';

interface Props {
  name: ReactNode;
  poster?: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}
export function TitlePageHeaderLayout({
  name,
  description,
  children,
  right,
  poster,
}: Props) {
  return (
    <div className="md:flex items-center justify-between gap-24 mb-24">
      {poster}
      <div className="flex-auto">
        {children}
        <h1 className="text-4xl md:text-5xl mb-8">{name}</h1>
        {description && (
          <div className="text-base font-normal">{description}</div>
        )}
      </div>
      {right}
    </div>
  );
}
