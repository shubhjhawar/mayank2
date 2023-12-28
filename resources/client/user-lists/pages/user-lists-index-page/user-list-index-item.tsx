import {Channel} from '@common/channels/channel';
import {Title} from '@app/titles/models/title';
import {Person} from '@app/titles/models/person';
import {useDeleteList} from '@app/user-lists/requests/use-delete-list';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import {Trans} from '@common/i18n/trans';
import React, {Fragment} from 'react';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {getUserListLink, UserListLink} from '@app/user-lists/user-list-link';
import {Button} from '@common/ui/buttons/button';
import {Link} from 'react-router-dom';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {UserListByline} from '@app/user-lists/user-list-byline';
import {UserListDetails} from '@app/user-lists/user-list-details';
import clsx from 'clsx';
import {TitlePoster} from '@app/titles/title-poster/title-poster';
import {PersonPoster} from '@app/people/person-poster/person-poster';
import {User} from '@common/auth/user';
import {useAuth} from '@common/auth/use-auth';

interface UserListIndexItemProps {
  list: Channel;
  user: User;
  showVisibility?: boolean;
}
export function UserListIndexItem({
  list,
  user,
  showVisibility = true,
}: UserListIndexItemProps) {
  const isMobile = useIsMobileMediaQuery();
  const {user: authUser} = useAuth();
  const canEdit = authUser && authUser.id === user.id;
  return (
    <div className="flex items-center gap-24 py-24 border-b">
      {!isMobile && <ItemsPreview list={list as Channel<Title | Person>} />}
      <section className="flex-auto">
        <div className="flex items-center gap-8">
          <UserListLink
            list={list}
            className="block text-lg font-semibold capitalize mr-auto"
          />
          {!list.config.preventDeletion && !list.internal && canEdit && (
            <Fragment>
              <Button
                elementType={Link}
                to={`${getUserListLink(list)}/edit`}
                variant="outline"
                size="2xs"
                color="primary"
              >
                <Trans message="Edit" />
              </Button>
              <DialogTrigger type="modal">
                <Button
                  color="danger"
                  variant="outline"
                  radius="rounded"
                  size="2xs"
                >
                  <Trans message="Delete" />
                </Button>
                <DeleteListDialog list={list} />
              </DialogTrigger>
            </Fragment>
          )}
        </div>
        {list.description && (
          <p className="text-sm text-muted mt-8 whitespace-nowrap">
            {list.description}
          </p>
        )}
        <div className="text-sm mt-12">
          <div className="md:flex items-center justify-between gap-24">
            {user && <UserListByline user={user} />}
            <UserListDetails
              list={list}
              showVisibility={showVisibility}
              className="max-md:mt-12"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface ItemPreviewProps {
  list: Channel<Title | Person>;
}
function ItemsPreview({list}: ItemPreviewProps) {
  if (!list.items?.length) return null;
  return (
    <div className="flex items-center rounded overflow-hidden">
      {list.items?.map((item, index) => (
        <div
          key={item.id}
          style={{zIndex: 100 - index}}
          className={clsx(
            'relative shadow-[2px_0_7px_#000] rounded overflow-hidden',
            index !== 0 && '-ml-30'
          )}
        >
          {item.model_type === 'title' ? (
            <TitlePoster title={item} size="w-70" srcSize="sm" />
          ) : (
            <PersonPoster person={item} size="w-70" srcSize="sm" />
          )}
          <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(221,238,255,.35)] pointer-events-none" />
        </div>
      ))}
    </div>
  );
}

interface DeleteButtonProps {
  list: Channel;
}
function DeleteListDialog({list}: DeleteButtonProps) {
  const deleteList = useDeleteList();
  const {close} = useDialogContext();

  return (
    <ConfirmationDialog
      isDanger
      title={<Trans message="Delete list" />}
      body={<Trans message="Are you sure you want to delete this list?" />}
      confirm={<Trans message="Delete" />}
      isLoading={deleteList.isLoading}
      onConfirm={() => deleteList.mutate({listId: list.id}, {onSuccess: close})}
    />
  );
}
