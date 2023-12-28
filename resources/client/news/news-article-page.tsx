import React, {Fragment} from 'react';
import {PageMetaTags} from '@common/http/page-meta-tags';
import {PageStatus} from '@common/http/page-status';
import {SitePageLayout} from '@app/site-page-layout';
import {useNewsArticle} from '@app/admin/news/requests/use-news-article';
import {NewsArticle} from '@app/titles/models/news-article';
import {useNewsArticles} from '@app/news/requests/use-news-articles';
import {Trans} from '@common/i18n/trans';
import {FormattedDate} from '@common/i18n/formatted-date';
import {BulletSeparatedItems} from '@app/titles/bullet-separated-items';
import {NewsArticleImage} from '@app/news/news-article-image';
import {NewsArticleLink} from '@app/news/news-article-link';
import {NewsArticleByline} from '@app/news/news-article-byline';
import {NewsArticleSourceLink} from '@app/news/news-article-source-link';

export function NewsArticlePage() {
  const query = useNewsArticle();

  const content = query.data ? (
    <Fragment>
      <PageMetaTags query={query} />
      <PageContent article={query.data.article} />
    </Fragment>
  ) : (
    <PageStatus query={query} loaderClassName="absolute inset-0 m-auto" />
  );

  return <SitePageLayout>{content}</SitePageLayout>;
}

interface PageContentProps {
  article: NewsArticle;
}
function PageContent({article}: PageContentProps) {
  return (
    <div className="lg:flex items-start gap-40 container mx-auto mt-14 md:mt-40 px-14 md:px-24">
      <main className="p-16 border rounded mb-24">
        <div className="flex-auto">
          <h1 className="text-3xl md:text-4xl mb-24">{article.title}</h1>
          <div className="md:flex items-start gap-16">
            <NewsArticleImage
              article={article}
              size="w-184 h-184"
              className="max-md:mb-24"
            />
            <p dangerouslySetInnerHTML={{__html: article.body}} />
          </div>
          <BulletSeparatedItems className="text-muted text-sm mt-24">
            <FormattedDate date={article.created_at} />
            <NewsArticleByline article={article} />
            <NewsArticleSourceLink article={article} />
          </BulletSeparatedItems>
        </div>
      </main>
      <OtherNews />
    </div>
  );
}

function OtherNews() {
  const query = useNewsArticles({
    perPage: 10,
  });

  return (
    <div className="w-full lg:w-400 max-w-full flex-shrink-0">
      <h2 className="text-2xl mb-14">
        <Trans message="Other news" />
      </h2>
      {query.data?.pagination.data.map(article => (
        <div
          key={article.id}
          className="flex items-center gap-14 rounded border mb-14 pr-14"
        >
          <NewsArticleImage article={article} size="w-80 h-80" lazy={false} />
          <div>
            <h3 className="text-sm font-semibold line-clamp-2">
              <NewsArticleLink article={article} />
            </h3>
            <BulletSeparatedItems className="text-muted text-sm mt-6">
              <FormattedDate date={article.created_at} />
              <NewsArticleByline article={article} />
            </BulletSeparatedItems>
          </div>
        </div>
      ))}
    </div>
  );
}
