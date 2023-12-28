import {Navbar} from '@common/ui/navigation/navbar/navbar';
import {SearchAutocomplete} from '@app/search/search-autocomplete';
import clsx from 'clsx';

interface Props {
  position?: 'fixed' | 'relative';
}
export function MainNavbar({position = 'relative'}: Props) {
  return (
    <Navbar
      size="md"
      menuPosition="primary"
      className={clsx(position, 'z-40 flex-shrink-0 w-full')}
      border="border-none"
      alwaysDarkMode
    >
      <SearchAutocomplete />
    </Navbar>
  );
}
