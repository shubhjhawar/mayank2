import {useState} from 'react';
import {IconButton} from '@common/ui/buttons/icon-button';
import {StarIcon} from '@common/icons/material/Star';
import {StarBorderIcon} from '@common/icons/material/StarBorder';
import clsx from 'clsx';

interface Props {
  count: number;
  value: number;
  onValueChange?: (value: number) => void;
  className?: string;
  readonly?: boolean;
}
export function StarSelector({
  count,
  value,
  onValueChange,
  className,
  readonly,
}: Props) {
  const [hoverRating, setHoverRating] = useState(value);
  return (
    <div
      className={clsx('flex items-center', className)}
      onPointerLeave={() => {
        if (!readonly) {
          setHoverRating(value);
        }
      }}
    >
      {Array.from({length: count}).map((_, i) => {
        const isActive = hoverRating >= i + 1;
        return (
          <IconButton
            key={i}
            size="sm"
            iconSize="md"
            color={isActive ? 'primary' : undefined}
            disabled={readonly}
            onClick={() => {
              onValueChange?.(i + 1);
            }}
            onPointerEnter={() => {
              setHoverRating(i + 1);
            }}
          >
            {isActive ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        );
      })}
    </div>
  );
}
