import {Fragment, ReactElement, ReactNode} from 'react';

interface Props {
  poster: ReactElement;
  children: ReactNode;
}
export function TitlePageAsideLayout({poster, children}: Props) {
  return (
    <div className="md:w-1/4 max-md:flex flex-shrink-0 md:sticky top-40">
      {poster}
      <div className="flex-auto max-md:ml-16 max-md:text-sm">{children}</div>
    </div>
  );
}

interface DetailItemProps {
  label: ReactNode;
  children: ReactNode;
}
export function DetailItem({label, children}: DetailItemProps) {
  return (
    <Fragment>
      <dt className="font-semibold">{label}</dt>
      <dl className="mb-12 md:mb-24">{children}</dl>
    </Fragment>
  );
}
