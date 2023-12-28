import {Title} from '@app/titles/models/title';
import {useReviews} from '@app/reviews/requests/use-reviews';
import {SiteSectionHeading} from '@app/titles/site-section-heading';
import {TitleRating} from '@app/reviews/title-rating';
import {Trans} from '@common/i18n/trans';
import {ReviewList} from '@app/reviews/review-list/review-list';
import {useLocalStorage} from '@common/utils/hooks/local-storage';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {ReviewListSortButton} from '@app/reviews/review-list/review-list-sort-button';
import {IllustratedMessage} from '@common/ui/images/illustrated-message';
import React from 'react';
import {FormattedDate} from '@common/i18n/formatted-date';

interface Props {
  title: Title;
}
export function TitlePageReviewList({title}: Props) {
  const isMobile = useIsMobileMediaQuery();
  const [sort, setSort] = useLocalStorage(
    `reviewSort.${title.model_type}`,
    'created_at:desc'
  );
  const query = useReviews(title);
  return (
    <div className="mt-48">
      <SiteSectionHeading
        titleAppend={
          query.totalItems ? <span>({query.totalItems})</span> : null
        }
        actions={
          <div className="flex items-center gap-24">
            {!isMobile && <TitleRating score={title.rating} />}
            <ReviewListSortButton
              value={sort}
              onValueChange={newValue => setSort(newValue)}
            />
          </div>
        }
      >
        <Trans message="Reviews" />
      </SiteSectionHeading>
      <ReviewList
        reviewable={title}
        showAccountRequiredMessage={title.status !== 'upcoming'}
        noResultsMessage={
          title.status === 'upcoming' ? (
            <IllustratedMessage
              className="mt-24"
              size="sm"
              title={<Trans message="This title is not released yet" />}
              description={
                <Trans
                  message="Come back after :date to see the reviews"
                  values={{date: <FormattedDate date={title.release_date} />}}
                />
              }
            />
          ) : undefined
        }
      />
    </div>
  );
}
