import React, {Fragment} from 'react';
import {PageMetaTags} from '@common/http/page-meta-tags';
import {PageStatus} from '@common/http/page-status';
import {TitlePageHeaderImage} from '@app/titles/pages/title-page/title-page-header-image';
import {Title} from '@app/titles/models/title';
import {TitlePageHeader} from '@app/titles/pages/title-page/title-page-header';
import {SitePageLayout} from '@app/site-page-layout';
import {TitlePageImageGrid} from '@app/titles/pages/title-page/sections/title-page-image-grid';
import {SiteSectionHeading} from '@app/titles/site-section-heading';
import {Trans} from '@common/i18n/trans';
import {useTitlePageData} from '@app/titles/requests/use-title-page-data';

export function TitleImagesPage() {
  const query = useTitlePageData();

  const content = query.data ? (
    <Fragment>
      <PageMetaTags query={query} />
      <PageContent title={query.data.title} />;
    </Fragment>
  ) : (
    <PageStatus query={query} loaderClassName="absolute inset-0 m-auto" />
  );

  return <SitePageLayout>{content}</SitePageLayout>;
}

interface PageContentProps {
  title: Title;
}
function PageContent({title}: PageContentProps) {
  return (
    <div>
      <TitlePageHeaderImage title={title} />
      <div className="container mx-auto mt-40">
        <TitlePageHeader title={title} showPoster />
        <TitlePageImageGrid
          images={title.images}
          srcSize="lg"
          count={24}
          heading={
            <SiteSectionHeading>
              <Trans message="Image gallery" />
            </SiteSectionHeading>
          }
        />
      </div>
    </div>
  );
}
