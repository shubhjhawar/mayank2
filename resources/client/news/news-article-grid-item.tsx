import {NewsArticleImage} from '@app/news/news-article-image';
import {NewsArticleLink} from '@app/news/news-article-link';
import {BulletSeparatedItems} from '@app/titles/bullet-separated-items';
import {FormattedDate} from '@common/i18n/formatted-date';
import {NewsArticle} from '@app/titles/models/news-article';

interface Props {
  article: NewsArticle;
}
export function NewsArticleGridItem({article}: Props) {
  return (
    <div className="flex items-start gap-14">
      <NewsArticleImage article={article} className="aspect-poster max-w-90" />
      <div className="mt-6 text-base min-w-0 overflow-hidden overflow-ellipsis">
        <NewsArticleLink article={article} className="font-medium" />
        <BulletSeparatedItems className="text-xs mt-10 min-w-0 overflow-hidden overflow-ellipsis">
          <FormattedDate date={article.created_at} />
          <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
            {article.source}
          </div>
        </BulletSeparatedItems>
      </div>
    </div>
  );
}
