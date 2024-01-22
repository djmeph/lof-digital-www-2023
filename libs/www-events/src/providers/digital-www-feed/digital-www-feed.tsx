import { FC } from 'react';
import { useQuery } from 'react-query';

import { EventsFeedContext } from '../../context/EventsFeedContext';
import { DataCoalesce, MainFeed } from '../../interfaces/www-events.interface';

export const DigitalWwwFeedProvider: FC = ({ children }) => {
  const events = useQuery<DataCoalesce, Error>(
    'jsonFeed',
    async (): Promise<DataCoalesce> => {
      const res = await fetch('/events.json');
      return res.json();
    }
  );

  const staticFeed = useQuery<MainFeed, Error>(
    'staticFeed',
    async (): Promise<MainFeed> => {
      const res = await fetch('/digital-www.json');
      return res.json();
    }
  );

  if (events.error)
    return <div>An error has occured: {events.error.message}</div>;

  if (staticFeed.error)
    return <div>An error has occured: {staticFeed.error.message}</div>;

  if (
    events.isLoading ||
    !events.data ||
    staticFeed.isLoading ||
    !staticFeed.data
  )
    return <h1 className="title">Reticulating Splines ...</h1>;

  return (
    <EventsFeedContext.Provider
      value={{ ...events.data.coalesce, ...staticFeed.data }}
    >
      {children}
    </EventsFeedContext.Provider>
  );
};

export default DigitalWwwFeedProvider;
