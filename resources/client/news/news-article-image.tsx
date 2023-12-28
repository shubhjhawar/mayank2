import defaultImage from './../titles/title-poster/default-title-poster.jpg';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import clsx from 'clsx';
import {NewsArticle} from '@app/titles/models/news-article';
import {NewsArticleLink} from '@app/news/news-article-link';

interface Props {
  article: NewsArticle;
  className?: string;
  size?: string;
  lazy?: boolean;
}
export function NewsArticleImage({
  article,
  className,
  size,
  lazy = true,
}: Props) {
  const {trans} = useTrans();
  const src = getNewsArticleImage(article);
  return (
    <NewsArticleLink article={article} className="flex-shrink-0 relative group">
      <img
        className={clsx(className, size, 'object-cover bg-fg-base/4 rounded')}
        draggable={false}
        loading={lazy ? 'lazy' : 'eager'}
        src={src}
        alt={trans(message('Image for :name', {values: {name: article.title}}))}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
    </NewsArticleLink>
  );
}

export function getNewsArticleImage(article: NewsArticle): string {
  return article.image || defaultImage;
}
