import React, {Fragment} from 'react';
import {MainNavbar} from '@app/main-navbar';
import {useDarkThemeVariables} from '@common/ui/themes/use-dark-theme-variables';
import {useWatchPageVideo} from '@app/videos/requests/use-watch-page-video';
import {Footer} from '@common/ui/footer/footer';
import {PageErrorMessage} from '@common/errors/page-error-message';
import {CommentList} from '@common/comments/comment-list/comment-list';
import {NewCommentForm} from '@common/comments/new-comment-form';
import {WatchPageTitleDetails} from '@app/videos/watch-page/watch-page-title-details';
import {WatchPageAside} from '@app/videos/watch-page/watch-page-aside';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';
import {useScrollToTop} from '@common/ui/navigation/use-scroll-to-top';
import {VideoPlayerSkeleton} from '@app/videos/video-player-skeleton';
import {SiteVideoPlayer} from '@app/videos/site-video-player';
import {useSettings} from '@common/core/settings/use-settings';
import {useAuth} from '@common/auth/use-auth';
import {useIsStreamingMode} from '@app/videos/use-is-streaming-mode';
import {WatchPageVideoSelector} from '@app/videos/watch-page/watch-page-video-selector';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {Trans} from '@common/i18n/trans';
import {AdHost} from '@common/admin/ads/ad-host';
import {Episode} from '@app/titles/models/episode';
import {Title} from '@app/titles/models/title';
import {Video} from '@app/titles/models/video';

export function WatchPage() {
  const darkThemeVars = useDarkThemeVariables();
  useScrollToTop();

  return (
    <Fragment>
      <MainNavbar position="fixed" />
      <div style={darkThemeVars} className="dark min-h-screen bg text">
        <div className="container mx-auto pt-76">
          <Content />
        </div>
        <Footer className="container mx-auto mt-48 flex-shrink-0" />
      </div>
    </Fragment>
  );
}

function Content() {
  const {titles, comments, streaming} = useSettings();
  const isStreamingMode = useIsStreamingMode();
  const {hasPermission} = useAuth();
  const {data, isLoading} = useWatchPageVideo();
  const title = data?.title;
  const episode = data?.episode;
  const video = data?.video;
  let commentable: Episode | Title | Video | undefined = video;

  if (!comments?.per_video) {
    commentable = episode || title;
  }

  const shouldShowComments =
    title && video && titles.enable_comments && hasPermission('comments.view');

  if (data || isLoading) {
    return (
      <Fragment key={video?.id || 'loading'}>
        {title && (
          <StaticPageTitle>
            <Trans message="Watch :name" values={{name: title.name}} />
          </StaticPageTitle>
        )}
        <AnimatePresence initial={false} mode="wait">
          {video ? (
            <m.div key="player" {...opacityAnimation}>
              <SiteVideoPlayer
                title={title}
                episode={data?.episode}
                video={video}
                relatedVideos={data?.related_videos}
                autoPlay
                logPlays
                showEpisodeSelector={isStreamingMode}
              />
            </m.div>
          ) : (
            <m.div className="relative" key="skeleton" {...opacityAnimation}>
              <VideoPlayerSkeleton animate />
            </m.div>
          )}
        </AnimatePresence>
        {streaming.show_video_selector ? (
          <WatchPageVideoSelector data={data} />
        ) : null}
        <AdHost slot="watch_top" className="pt-48" />
        <section className="mt-42 flex items-start gap-56">
          <div className="flex-auto">
            <WatchPageTitleDetails />
            {shouldShowComments && (
              <CommentList
                commentable={commentable!}
                className="mt-44"
                perPage={20}
              >
                <NewCommentForm
                  commentable={commentable!}
                  className="mb-14 mt-24"
                />
              </CommentList>
            )}
          </div>
          <WatchPageAside />
        </section>
      </Fragment>
    );
  }

  return <PageErrorMessage />;
}
