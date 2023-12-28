import React, {Fragment, useMemo} from 'react';
import {FormImageSelector} from '@common/ui/images/image-selector';
import {Trans} from '@common/i18n/trans';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {FormDatePicker} from '@common/ui/forms/input-field/date/date-picker/date-picker';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {useValueLists} from '@common/http/value-lists';
import {Item} from '@common/ui/forms/listbox/item';

export function PersonPrimaryFactsForm() {
  return (
    <Fragment>
      <div className="md:flex gap-24">
        <FormImageSelector
          variant="square"
          previewSize="w-204 aspect-poster"
          name="poster"
          diskPrefix="person-posters"
          label={<Trans message="Poster" />}
        />
        <div className="flex-auto max-md:mt-24">
          <FormTextField
            name="name"
            label={<Trans message="Name" />}
            className="mb-24"
            required
          />
          <KnownForField />
          <FormDatePicker
            name="birth_date"
            label={<Trans message="Birth date" />}
            className="mb-24"
            granularity="day"
          />
          <FormDatePicker
            name="death_date"
            label={<Trans message="Death date" />}
            className="mb-24"
            granularity="day"
          />
        </div>
      </div>
      <FormTextField
        name="description"
        label={<Trans message="Biography" />}
        inputElementType="textarea"
        rows={4}
        className="mb-24"
      />
      <div className="md:flex items-center gap-24 mb-24">
        <FormTextField
          name="birth_place"
          label={<Trans message="Birth place" />}
          className="flex-1 max-md:mb-24"
        />
      </div>
      <div className="md:flex items-center gap-24 mb-24">
        <FormSelect
          name="gender"
          label={<Trans message="Gender" />}
          className="flex-1 max-md:mb-24"
          selectionMode="single"
        >
          <Option value="male">
            <Trans message="Male" />
          </Option>
          <Option value="female">
            <Trans message="Femlae" />
          </Option>
        </FormSelect>
      </div>
      <div className="md:flex items-center gap-24 mb-24">
        <FormTextField
          name="popularity"
          label={<Trans message="Popularity" />}
          type="number"
          min={1}
          className="flex-1 max-md:mb-24"
        />
      </div>
    </Fragment>
  );
}

function KnownForField() {
  const {data} = useValueLists(['tmdbDepartments']);
  const departments = useMemo(() => {
    return data?.tmdbDepartments.map(item => {
      if (item.department === 'Actors') {
        return {department: 'Acting'};
      }
      return {department: item.department};
    });
  }, [data]);

  return (
    <FormSelect
      name="known_for"
      label={<Trans message="Known for" />}
      required
      items={departments}
      className="mb-24"
      selectionMode="single"
      showSearchField
    >
      {item => (
        <Item value={item.department}>
          <Trans message={item.department} />
        </Item>
      )}
    </FormSelect>
  );
}
