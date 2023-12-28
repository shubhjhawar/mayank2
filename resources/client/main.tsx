import './app.css';
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {createRoot} from 'react-dom/client';
import {AppearanceListener} from '@common/admin/appearance/commands/appearance-listener';
import {CommonProvider} from '@common/core/common-provider';
import {AuthRoutes} from '@common/auth/auth-routes';
import {AuthRoute} from '@common/auth/guards/auth-route';
import {FullPageLoader} from '@common/ui/progress/full-page-loader';
import {BillingRoutes} from '@common/billing/billing-routes';
import {NotificationRoutes} from '@common/notifications/notification-routes';
import {CookieNotice} from '@common/ui/cookie-notice/cookie-notice';
import {ContactUsPage} from '@common/contact/contact-us-page';
import {CustomPageLayout} from '@common/custom-page/custom-page-layout';
import {ToastContainer} from '@common/ui/toast/toast-container';
import {useAuth} from '@common/auth/use-auth';
import {EmailVerificationPage} from '@common/auth/ui/email-verification-page/email-verification-page';
import * as Sentry from '@sentry/react';
import {rootEl} from '@common/core/root-el';
import {useSettings} from '@common/core/settings/use-settings';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';
import {NotFoundPage} from '@common/ui/not-found-page/not-found-page';
import {useAppearanceEditorMode} from '@common/admin/appearance/commands/use-appearance-editor-mode';
import {ignoredSentryErrors} from '@common/errors/ignored-sentry-errors';
import {DialogStoreOutlet} from '@common/ui/overlays/store/dialog-store-outlet';
import {UserLink} from '@app/profile/user-link';
import {UserProfile} from '@app/profile/user-profile';
import {DynamicHomepage} from '@common/ui/dynamic-homepage';
import {LandingPageContent} from '@app/landing-page/landing-page-content';
import {LandingPage} from '@app/landing-page/landing-page';
import {Title} from '@app/titles/models/title';

const AdminRoutes = React.lazy(() => import('@common/admin/admin-routes'));
const SwaggerApiDocs = React.lazy(
  () => import('@common/swagger/swagger-api-docs-page')
);
const SiteRoutes = React.lazy(() => import('@app/site-routes'));

declare module '@common/http/value-lists' {
  interface FetchValueListsResponse {
    titleFilterLanguages: {value: string; name: string}[];
    productionCountries: {value: string; name: string}[];
    genres: {value: string; name: string}[];
    keywords: {value: string; name: string}[];
    titleFilterAgeRatings: {value: string; name: string}[];
    tmdbLanguages: {name: string; code: string}[];
    tmdbDepartments: {department: string; jobs: string[]}[];
  }
}

declare module '@common/core/bootstrap-data/bootstrap-data' {
  interface BootstrapData {
    trendingTitles?: Title[];
  }
}

declare module '@common/core/settings/settings' {
  interface Settings {
    homepage?: {
      type?: string;
      value?: string;
      pricing?: boolean;
      appearance: LandingPageContent;
      trending?: boolean;
    };
    ads?: {
      general_top?: string;
      general_bottom?: string;
      title_top?: string;
      person_top?: string;
      watch_top?: string;
      disable?: boolean;
    };
    tmdb_is_setup: boolean;
    streaming: {
      default_sort: string;
      show_header_play: boolean;
      prefer_full: boolean;
      qualities: string;
      show_video_selector: boolean;
    };
    comments?: {
      per_video: boolean;
    };
    titles: {
      video_panel_mode?: 'hide' | 'carousel' | 'table';
      enable_reviews?: boolean;
      enable_comments?: boolean;
    };
    title_page?: {
      sections: string;
    };
    content: {
      title_provider?: 'tmdb';
      people_provider?: 'tmdb';
      search_provider: 'local' | 'tmdb' | 'all';
    };
  }
}

declare module '@common/auth/user' {
  interface User {
    profile?: UserProfile;
    links?: UserLink[];
    lists_count?: number;
    is_pro?: boolean;
  }
}

const sentryDsn = getBootstrapData().settings.logging.sentry_public;
if (sentryDsn && import.meta.env.PROD) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
    ignoreErrors: ignoredSentryErrors,
    release: getBootstrapData().sentry_release,
  });
}

const root = createRoot(rootEl);
root.render(
  <CommonProvider>
    <Router />
  </CommonProvider>
);

function Router() {
  const {
    homepage,
    billing,
    notifications,
    require_email_confirmation,
    api,
    html_base_uri,
  } = useSettings();
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const {user, hasPermission} = useAuth();

  if (user != null && require_email_confirmation && !user.email_verified_at) {
    return (
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="*" element={<EmailVerificationPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter basename={html_base_uri}>
      <AppearanceListener />
      <CookieNotice />
      <ToastContainer />
      <Routes>
        <Route
          path="/*"
          element={
            <AuthRoute requireLogin={false} permission="titles.view">
              <React.Suspense fallback={<FullPageLoader screen />}>
                <SiteRoutes />
              </React.Suspense>
            </AuthRoute>
          }
        />
        {!homepage?.type?.startsWith('channel') &&
          (user == null || isAppearanceEditorActive) && (
            <Route
              path="/"
              element={
                <DynamicHomepage homepageResolver={() => <LandingPage />} />
              }
            />
          )}
        <Route
          path="/admin/*"
          element={
            <AuthRoute permission="admin.access">
              <React.Suspense fallback={<FullPageLoader screen />}>
                <AdminRoutes />
              </React.Suspense>
            </AuthRoute>
          }
        />
        {AuthRoutes}
        {billing.enable && BillingRoutes}
        {notifications.integrated && NotificationRoutes}
        {api?.integrated && hasPermission('api.access') && (
          <Route
            path="api-docs"
            element={
              <React.Suspense fallback={<FullPageLoader screen />}>
                <SwaggerApiDocs />
              </React.Suspense>
            }
          />
        )}
        <Route path="contact" element={<ContactUsPage />} />
        <Route path="pages/:pageSlug" element={<CustomPageLayout />} />
        <Route path="pages/:pageId/:pageSlug" element={<CustomPageLayout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <DialogStoreOutlet />
    </BrowserRouter>
  );
}
