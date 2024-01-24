import React, { Fragment } from 'react';
import clsx from 'clsx';
import { IconButton } from '@common/ui/buttons/icon-button';
import { KeyboardArrowLeftIcon } from '@common/icons/material/KeyboardArrowLeft';
import { KeyboardArrowRightIcon } from '@common/icons/material/KeyboardArrowRight';
import { useCarousel } from './use-carousel';
import { ChannelContentGridItem } from '../content-grid/channel-content-grid-item';
import { ChannelContentModel } from '@app/admin/channels/channel-content-config';
import { FaBirthdayCake, FaBeer, FaGift } from 'react-icons/fa';
import { LuPartyPopper } from "react-icons/lu";
import { GiPartyHat } from "react-icons/gi"; 
import { IoBalloon } from "react-icons/io5";

export function BirthdayContentCarousel() {
  const variant = 'landscape';
  
  // dummy data
  const peopleData: ChannelContentModel[] = [
    {
      birth_date: "1967-07-26T00:00:00.000000Z",
      birth_place: "London, England",
      death_date: null,
      id: 10,
      model_type: "person",
      name: "Jason Statham",
      description: "British actor and film producer",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      popularity: 134,
      poster: "https://image.tmdb.org/t/p/original/lldeQ91GwIVff43JBrpdbAAeYWj.jpg",
    },
    {
      birth_date: "1970-11-11T00:00:00.000000Z",
      birth_place: "Unknown",
      death_date: "2022-01-01T00:00:00.000000Z",
      id: 30,
      model_type: "person",
      name: "John Doe",
      description: "Mysterious figure",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      popularity: 90,
      poster: "https://image.tmdb.org/t/p/original/lldeQ91GwIVff43JBrpdbAAeYWj.jpg",
    },
    {
      birth_date: "1985-05-15T00:00:00.000000Z",
      birth_place: "New York, USA",
      death_date: null,
      id: 30,
      model_type: "person",
      name: "Jane Smith",
      description: "American actress",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      popularity: 110,
      poster: "https://image.tmdb.org/t/p/original/lldeQ91GwIVff43JBrpdbAAeYWj.jpg",
    },
    {
      birth_date: "1985-05-15T00:00:00.000000Z",
      birth_place: "New York, USA",
      death_date: null,
      id: 30,
      model_type: "person",
      name: "Jane Smith",
      description: "American actress",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      popularity: 110,
      poster: "https://image.tmdb.org/t/p/w300/rUaw3hLRxK4T9Vp9yS1YxQ2PgnT.jpg",
    },
    {
      birth_date: "1985-05-15T00:00:00.000000Z",
      birth_place: "New York, USA",
      death_date: null,
      id: 30,
      model_type: "person",
      name: "Jane Smith",
      description: "American actress",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      popularity: 110,
      poster: "https://image.tmdb.org/t/p/w300/5Brc5dLifH3UInk3wUaCuGXpCqy.jpg",
    },
    {
      birth_date: "1985-05-15T00:00:00.000000Z",
      birth_place: "New York, USA",
      death_date: null,
      id: 30,
      model_type: "person",
      name: "Jane Smith",
      description: "American actress",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      popularity: 110,
      poster: "https://image.tmdb.org/t/p/w300/6dEFBpZH8C8OijsynkSajQT99Pb.jpg",
    },
  ];
  
  const {
    scrollContainerRef,
    canScrollForward,
    canScrollBackward,
    scrollToPreviousPage,
    scrollToNextPage,
    containerClassName,
    itemClassName,
  } = useCarousel();

  return (
    <div>
      <div className='w-full flex justify-between'>
        <div className='flex items-center justify-center gap-4'>
          <div className='w-4 h-[50px] bg-[#FB8C00] rounded-full'></div>
          <h2 className='p-5 mt-10 hover:underline cursor-pointer'>Birthdays Today</h2>
        </div>
        {/* left right icon */}
        <div className='flex gap-8'>
          <Fragment>
            <IconButton
              disabled={!canScrollBackward}
              onClick={() => scrollToPreviousPage()}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              disabled={!canScrollForward}
              onClick={() => scrollToNextPage()}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Fragment>
        </div> 
      </div>
      <div
        ref={scrollContainerRef}
        className={clsx(
          containerClassName,
          variant === 'landscape'
            ? 'content-grid-landscape'
            : 'content-grid-portrait'
        )}
      >
        {peopleData.map((item, index) => (
          <div className={itemClassName} key={`${item.id}-${item.model_type}`}>
            <ChannelContentGridItem item={item} variant={variant} />
            <div className='absolute relative bottom-100  text-[#FB8C00] w-[100px] flex justify-center text-[50px]'><DisplayBirthdayIcon index={index+1} total_length={peopleData?.length}/></div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

interface birthdayIcons{
  index: number,
  total_length: number
}

const DisplayBirthdayIcon = ({index, total_length} : birthdayIcons) => {
  const icons = [
    <FaBirthdayCake />,
    <FaBeer />,
    <LuPartyPopper />,
    <FaGift />,
    <GiPartyHat />,
    <IoBalloon />,
  ];

  const iconIndex = total_length % index;
  return icons[iconIndex];
}