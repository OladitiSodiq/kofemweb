import {Navbar} from '@common/ui/navigation/navbar/navbar';
import {LinkGroup} from '@app/dashboard/link-groups/link-group';
import {removeProtocol} from '@common/utils/urls/remove-protocol';
import {RemoteFavicon} from '@common/ui/remote-favicon';
import {LinkStyle} from '@common/ui/buttons/external-link';
import clsx from 'clsx';
import {LinkClipboardButton} from '@app/dashboard/links/sharing/link-clipboard-button';
import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';
import {Link} from '@app/dashboard/links/link';
import {Fragment, ReactElement} from 'react';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';
import {IllustratedMessage} from '@common/ui/images/illustrated-message';
import shareLink from '@app/dashboard/links/share-link.svg';
import {SvgImage} from '@common/ui/images/svg-image/svg-image';
import {Trans} from '@common/i18n/trans';
import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';

interface LinkGroupRendererProps {
  linkGroup: LinkGroup;
}
export function LinkGroupRenderer({linkGroup}: LinkGroupRendererProps) {
  const query = useInfiniteData<Link>({
    willSortOrFilter: true,
    queryKey: ['link-group', linkGroup.id, 'links'],
    endpoint: `link-group/${linkGroup.id}/links`,
    paginate: 'simple',
  });

  let content: ReactElement;

  if (query.isLoading) {
    content = <Skeletons key="skeletons" />;
  } else if (query.noResults) {
    content = (
      <IllustratedMessage
        className="mt-80"
        image={<SvgImage src={shareLink} />}
        title={<Trans message="Nothing to show" />}
        description={<Trans message="This group does not have any links yet" />}
        key="illustration"
      />
    );
  } else {
    content = <LinkList key="linkList" data={query.items} />;
  }

  return (
    <div className="bg-alt flex flex-col min-h-screen">
      <Navbar
        menuPosition="link-page-navbar"
        className="sticky top-0 flex-shrink-0"
      />
      <div className="container mx-auto px-24 py-40 flex-auto">
        <h1 className="text-3xl mb-40">{linkGroup.name}</h1>
        <div>
          <AnimatePresence initial={false} mode="wait">
            {content}
          </AnimatePresence>
          <InfiniteScrollSentinel query={query} />
        </div>
      </div>
    </div>
  );
}

interface LinkListProps {
  data?: Link[];
}
function LinkList({data}: LinkListProps) {
  return (
    <Fragment>
      {data?.map(link => (
        <m.div
          {...opacityAnimation}
          key={link.id}
          className="p-20 shadow rounded-lg mb-20 bg-paper"
        >
          <div className="flex items-center gap-8">
            <RemoteFavicon url={link.long_url} />
            <a
              target="_blank"
              href={link.long_url}
              className={clsx(LinkStyle, 'font-medium')}
              rel="noreferrer"
            >
              {removeProtocol(link.long_url)}
            </a>
          </div>
          <LinkClipboardButton
            link={link}
            variant="text"
            className="text-sm hover:underline"
          />
          {link.description && (
            <div className="text-muted text-sm mt-14">{link.description}</div>
          )}
        </m.div>
      ))}
    </Fragment>
  );
}

function Skeletons() {
  const skeletons = Array.from(Array(10).keys());
  return (
    <m.div {...opacityAnimation} key="skeleton">
      {skeletons.map(skeleton => (
        <m.div className="p-20 shadow rounded-lg mb-20 bg-paper" key={skeleton}>
          <Skeleton className="text-sm mb-14" />
          <Skeleton className="text-xs" />
          <Skeleton className="text-xs" />
        </m.div>
      ))}
    </m.div>
  );
}
