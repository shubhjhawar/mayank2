import {Title} from '@app/titles/models/title';
import {TitlePoster} from '@app/titles/title-poster/title-poster';
import {Trans} from '@common/i18n/trans';
import {FormattedCurrency} from '@common/i18n/formatted-currency';
import {WatchlistButton} from '@app/user-lists/watchlist-button';
import {
  DetailItem,
  TitlePageAsideLayout,
} from '@app/titles/pages/title-page/title-page-aside-layout';
import {KeywordLink} from '@app/titles/keyword-link';
import {useValueLists} from '@common/http/value-lists';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';
import {ProductionCountryLink} from '@app/titles/production-country-link';
import {WatchNowButton} from '@app/titles/pages/title-page/watch-now-button';
import {useIsStreamingMode} from '@app/videos/use-is-streaming-mode';
import {getTitleLink} from '@app/titles/title-link';
import {ShareMenuTrigger} from '@app/sharing/share-menu-trigger';
import {Button} from '@common/ui/buttons/button';
import React from 'react';
import {ShareIcon} from '@common/icons/material/Share';

interface Props {
  title: Title;
}
export function TitlePageAside({title}: Props) {
  const isStreamingMode = useIsStreamingMode();
  return (
    <TitlePageAsideLayout
      poster={<TitlePoster title={title} size="w-full" srcSize="lg" />}
    >
      {isStreamingMode && title.primary_video && (
        <WatchNowButton video={title.primary_video} variant="flat" />
      )}
      <WatchlistButton
        item={title}
        variant={isStreamingMode ? 'outline' : 'flat'}
      />
      <ShareButton title={title} />
      <dl className="mt-14">
        {title.language && <LanguageDetailItem languageCode={title.language} />}
        {title.original_title !== title.name && (
          <DetailItem label={<Trans message="Original title" />}>
            {title.original_title}
          </DetailItem>
        )}
        {title.budget ? (
          <DetailItem label={<Trans message="Budget" />}>
            <FormattedCurrency value={title.budget} currency="usd" />
          </DetailItem>
        ) : null}
        {title.revenue ? (
          <DetailItem label={<Trans message="Revenue" />}>
            <FormattedCurrency value={title.revenue} currency="usd" />
          </DetailItem>
        ) : null}
        {title.production_countries?.length ? (
          <DetailItem label={<Trans message="Production countries" />}>
            <ul className="mt-12 flex flex-wrap gap-8">
              {title.production_countries.map(country => (
                <li
                  key={country.id}
                  className="w-max rounded-full border px-10 py-4 text-xs"
                >
                  <ProductionCountryLink country={country} />
                </li>
              ))}
            </ul>
          </DetailItem>
        ) : null}
        {title.keywords?.length ? (
          <DetailItem label={<Trans message="Keywords" />}>
            <ul className="mt-12 flex flex-wrap gap-8">
              {title.keywords.map(keyword => (
                <li
                  key={keyword.id}
                  className="w-max rounded-full border px-10 py-4 text-xs"
                >
                  <KeywordLink keyword={keyword} />
                </li>
              ))}
            </ul>
          </DetailItem>
        ) : null}
      </dl>
    </TitlePageAsideLayout>
  );
}

interface LanguageDetailItemProps {
  languageCode: string;
}
function LanguageDetailItem({languageCode}: LanguageDetailItemProps) {
  const {data, isLoading} = useValueLists(['languages']);

  const language =
    data?.languages?.find(lang => lang.code === languageCode)?.name ||
    'Unknown';

  return (
    <AnimatePresence mode="wait">
      <DetailItem label={<Trans message="Original language" />}>
        {isLoading ? (
          <m.span {...opacityAnimation} key="skeleton">
            <Skeleton variant="text" />
          </m.span>
        ) : (
          <m.span key="language">
            <Trans message={language} />
          </m.span>
        )}
      </DetailItem>
    </AnimatePresence>
  );
}

interface ShareButtonProps {
  title: Title;
}
function ShareButton({title}: ShareButtonProps) {
  const link = getTitleLink(title, {absolute: true});
  return (
    <ShareMenuTrigger link={link}>
      <Button
        variant="outline"
        color="primary"
        startIcon={<ShareIcon />}
        className="mt-14 min-h-40 w-full"
      >
        <Trans message="Share" />
      </Button>
    </ShareMenuTrigger>
  );
}
