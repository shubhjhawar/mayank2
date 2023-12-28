import {GetTitleResponse} from '@app/titles/requests/use-title';
import {PageStatus} from '@common/http/page-status';
import {PageMetaTags} from '@common/http/page-meta-tags';
import React, {Fragment} from 'react';
import {TitlePageMainContent} from '@app/titles/pages/title-page/title-page-main-content';
import {TitlePageHeader} from '@app/titles/pages/title-page/title-page-header';
import {TitlePageHeaderImage} from '@app/titles/pages/title-page/title-page-header-image';
import {TitlePageAside} from '@app/titles/pages/title-page/title-page-aside';
import {SitePageLayout} from '@app/site-page-layout';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {useTitlePageData} from '@app/titles/requests/use-title-page-data';

export function TitlePage() {
  const query = useTitlePageData();

  const content = query.data ? (
    <Fragment>
      <PageMetaTags query={query} />
      <PageContent data={query.data} />
    </Fragment>
  ) : (
    <PageStatus query={query} loaderClassName="absolute inset-0 m-auto" />
  );

  return <SitePageLayout>{content}</SitePageLayout>;
}

interface PageContentProps {
  data: GetTitleResponse;
}
function PageContent({data}: PageContentProps) {
  const isMobile = useIsMobileMediaQuery();
  return (
    <Fragment>
      <TitlePageHeaderImage title={data.title} />
      <div className="container mx-auto mt-24 md:mt-40 px-14 md:px-24">
        <div className="md:flex items-start gap-54">
          {!isMobile && <TitlePageAside title={data.title} />}
          <div className="flex-auto">
            <TitlePageHeader title={data.title} />
            <TitlePageMainContent data={data} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
