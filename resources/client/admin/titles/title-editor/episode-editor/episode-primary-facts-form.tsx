import {FormImageSelector} from '@common/ui/images/image-selector';
import {Trans} from '@common/i18n/trans';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {FormDatePicker} from '@common/ui/forms/input-field/date/date-picker/date-picker';
import React, {Fragment, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useOutletContext, useParams} from 'react-router-dom';
import {Form} from '@common/ui/forms/form';
import {useUpdateEpisode} from '@app/episodes/requests/use-update-episode';
import {EpisodeEditorLayout} from '@app/admin/titles/title-editor/episode-editor/episode-editor-layout';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {
  CreateEpisodePayload,
  useCreateEpisode,
} from '@app/episodes/requests/use-create-episode';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {Button} from '@common/ui/buttons/button';
import {useCurrentDateTime} from '@common/i18n/use-current-date-time';
import {Title} from '@app/titles/models/title';
import {useEpisode} from '@app/episodes/requests/use-episode';
import {TitleEditorPageStatus} from '@app/admin/titles/title-editor/title-editor-page-status';

export function EpisodePrimaryFactsForm() {
  const {episode: episodeNumber} = useParams();
  if (episodeNumber) {
    return <UpdateEpisodeForm />;
  } else {
    return <NewEpisodeForm />;
  }
}

function NewEpisodeForm() {
  const title = useOutletContext<Title>();
  const {season} = useParams();
  const navigate = useNavigate();
  const now = useCurrentDateTime();
  const form = useForm<CreateEpisodePayload>({
    defaultValues: {
      release_date: now.toAbsoluteString(),
    },
  });
  const createEpisode = useCreateEpisode(form, title.id, season!);
  const isDirty = Object.keys(form.formState.dirtyFields).length > 0;

  return (
    <Form
      form={form}
      onSubmit={values => {
        createEpisode.mutate(values, {
          onSuccess: response => {
            toast(message('Episode created'));
            navigate(`../${response.episode.episode_number}`, {
              relative: 'path',
            });
          },
        });
      }}
    >
      <EpisodeEditorLayout
        actions={
          <Button
            variant="flat"
            color="primary"
            type="submit"
            disabled={createEpisode.isLoading || !isDirty}
          >
            <Trans message="Save" />
          </Button>
        }
      >
        <FormFields />
      </EpisodeEditorLayout>
    </Form>
  );
}

function UpdateEpisodeForm() {
  const query = useEpisode();
  const title = useOutletContext<Title>();
  const {season, episode: episodeNumber} = useParams();
  const episode = query.data?.episode;
  const navigate = useNavigate();
  const form = useForm<CreateEpisodePayload>();

  useEffect(() => {
    if (episode) {
      form.reset({
        name: episode.name,
        description: episode.description,
        release_date: episode.release_date,
        runtime: episode.runtime,
        popularity: episode.popularity,
        poster: episode.poster,
      });
    }
  }, [form, episode]);

  const updateEpisode = useUpdateEpisode(
    title.id,
    season!,
    episodeNumber!,
    form
  );

  return (
    <Form
      form={form}
      onSubmit={values => {
        updateEpisode.mutate(values, {
          onSuccess: () => {
            toast(message('Episode updated'));
            navigate('../../../', {relative: 'path'});
          },
        });
      }}
    >
      <EpisodeEditorLayout
        actions={
          <Button
            variant="flat"
            color="primary"
            type="submit"
            disabled={updateEpisode.isLoading || !form.formState.isDirty}
          >
            <Trans message="Save" />
          </Button>
        }
      >
        {query.data ? <FormFields /> : <TitleEditorPageStatus query={query} />}
      </EpisodeEditorLayout>
    </Form>
  );
}

function FormFields() {
  return (
    <Fragment>
      <div className="md:flex gap-24">
        <FormImageSelector
          variant="square"
          previewSize="w-204 aspect-poster"
          name="poster"
          diskPrefix="episode-posters"
          label={<Trans message="Poster" />}
          stretchPreview
        />
        <div className="flex-auto mb-24 max-md:mt-24">
          <FormTextField
            name="name"
            label={<Trans message="Title" />}
            className="mb-24"
            required
          />
          <FormDatePicker
            name="release_date"
            label={<Trans message="Release date" />}
            className="mb-24"
            granularity="day"
          />
          <FormTextField
            name="runtime"
            label={<Trans message="Runtime" />}
            type="number"
            min={1}
            className="mb-24"
          />
          <FormTextField
            name="popularity"
            label={<Trans message="Popularity" />}
            type="number"
            min={1}
          />
        </div>
      </div>
      <FormTextField
        name="description"
        label={<Trans message="Overview" />}
        inputElementType="textarea"
        rows={6}
        className="mb-24"
      />
    </Fragment>
  );
}
