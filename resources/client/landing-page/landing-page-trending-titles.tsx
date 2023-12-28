import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';
import {Trans} from '@common/i18n/trans';
import React from 'react';
import {Title} from '@app/titles/models/title';
import {useImageSrc} from '@app/images/use-image-src';
import {message} from '@common/i18n/message';
import {useTrans} from '@common/i18n/use-trans';
import {getTitleBackdrop} from '@app/titles/title-poster/title-backdrop';

export function LandingPageTrendingTitles() {
  const titles = getBootstrapData().trendingTitles;
  if (!titles?.length) {
    return null;
  }

  return (
    <div className="landing-container mb-14 md:mb-80">
      <div className="mt-14 h-1 bg-divider md:mb-80" />
      <h2 className="mb-34 text-center text-4xl">
        <Trans message="See what's currently trending." />
      </h2>
      <div className="grid grid-cols-3 gap-24">
        {titles.map(title => (
          <TitleItem key={title.id} title={title} />
        ))}
      </div>
    </div>
  );
}

interface TitleItemProps {
  title: Title;
}
function TitleItem({title}: TitleItemProps) {
  const src = useImageSrc(getTitleBackdrop(title), {size: 'lg'});
  const {trans} = useTrans();
  return (
    <div>
      <div className="relative">
        <img
          className="block h-full w-full rounded bg-fg-base/4 object-cover"
          draggable={false}
          loading="lazy"
          src={src}
          alt={trans(message('Poster for :name', {values: {name: title.name}}))}
        />
      </div>
      <div className="mt-10 text-center text-base font-medium">
        {title.name}
      </div>
    </div>
  );
}
