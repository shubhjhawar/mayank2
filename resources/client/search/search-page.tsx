import {useSearchResults} from '@app/search/requests/use-search-results';
import {useParams} from 'react-router-dom';
import {SitePageLayout} from '@app/site-page-layout';
import {Trans} from '@common/i18n/trans';
import {SiteSectionHeading} from '@app/titles/site-section-heading';
import React, {Fragment, useMemo} from 'react';
import {Title, TITLE_MODEL} from '@app/titles/models/title';
import {Person, PERSON_MODEL} from '@app/titles/models/person';
import {ContentGrid} from '@app/channels/content-grid/channel-content-grid';
import {PageMetaTags} from '@common/http/page-meta-tags';

export function SearchPage() {
  const {query: searchTerm} = useParams();
  const query = useSearchResults({query: searchTerm});

  const {movies, series, people} = useMemo(() => {
    const movies: Title[] = [];
    const series: Title[] = [];
    const people: Person[] = [];

    query.data?.results.forEach(result => {
      if (result.model_type === TITLE_MODEL && result.is_series) {
        series.push(result);
      } else if (result.model_type === TITLE_MODEL && !result.is_series) {
        movies.push(result);
      } else if (result.model_type === PERSON_MODEL) {
        people.push(result);
      }
    });

    return {movies, series, people};
  }, [query]);

  return (
    <Fragment>
      <PageMetaTags query={query} />
      <SitePageLayout>
        <section className="container mx-auto mt-24 px-14 md:mt-40 md:px-24">
          <SiteSectionHeading className="mb-48" headingType="h1" hideBorder>
            <Trans
              message="Search results for: “:query“"
              values={{query: searchTerm}}
            />
          </SiteSectionHeading>
          <main>
            {movies.length > 0 && (
              <div className="mb-48">
                <SiteSectionHeading fontSize="text-2xl">
                  <Trans message="Movies" />
                </SiteSectionHeading>
                <ContentGrid content={movies} variant="portrait" />
              </div>
            )}
            {series.length > 0 && (
              <div className="mb-48">
                <SiteSectionHeading fontSize="text-2xl">
                  <Trans message="Series" />
                </SiteSectionHeading>
                <ContentGrid content={series} variant="portrait" />
              </div>
            )}
            {people.length > 0 && (
              <div className="mb-48">
                <SiteSectionHeading fontSize="text-2xl">
                  <Trans message="People" />
                </SiteSectionHeading>
                <ContentGrid content={people} variant="portrait" />
              </div>
            )}
          </main>
        </section>
      </SitePageLayout>
    </Fragment>
  );
}
