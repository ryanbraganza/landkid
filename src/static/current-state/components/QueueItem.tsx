import * as React from 'react';
import { css } from 'emotion';
import * as distanceInWords from 'date-fns/distance_in_words_to_now';
import { Lozenge } from './Lozenge';
import { LozengeAppearance } from './types';
import { User } from './User';

let queueItemStyles = css({
  display: 'block',
  boxSizing: 'border-box',
  padding: '12px 12px 8px',
  position: 'relative',
  boxShadow: 'rgba(23, 43, 77, 0.24) 0px 0px 1px 0px',
  backgroundColor: 'white',
  borderRadius: '3px',
  transition: 'box-shadow 0.3s',
  color: 'inherit',

  '&:hover': {
    boxShadow: 'rgba(23, 43, 77, 0.32) 0px 4px 8px -2px, rgba(23, 43, 77, 0.25) 0px 0px 1px',
    color: 'inherit',
    textDecoration: 'none',
  },

  '& .queue-item__title': {
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.25',
    maxWidth: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginBottom: '3px',
  },

  '& .queue-item__status-line': {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    marginTop: 'auto',
    overflow: 'hidden',
    height: '28px',
  },

  '& .queue-item__status-item': {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 'calc(100% - 16px)',
    height: '28px',

    '& + .queue-item__status-item': {
      marginLeft: '9px',
    },
  },

  '& .queue-item__status-item-title': {
    display: 'block',
    color: 'var(--n300-color)',
    fontSize: '12px',
    lineHeight: '1.33333',
    marginRight: '6px',
  },
});

let queueItemJoinedStyles = css({
  paddingTop: '27px',
  position: 'relative',
  '&:before': {
    position: 'absolute',
    display: 'block',
    content: '""',
    width: '1px',
    height: '27px',
    background: 'var(--n20-color)',
    top: '0',
    left: '50%',
    marginLeft: '-1px',
  },
});

let duration = (start: number, end: number) => {
  let diffMs = end - start;
  let rawSeconds = diffMs / 1000;
  let minutes = Math.floor(rawSeconds / 60);
  let seconds = Math.floor(rawSeconds - minutes * 60);
  return `${minutes}m ${seconds}s`;
};

export type StatusItemProps = {
  title: string;
};

export const StatusItem: React.FunctionComponent<StatusItemProps> = props => (
  <div className="queue-item__status-item">
    <span className="queue-item__status-item-title">{props.title}</span>
    {props.children}
  </div>
);

const landStatusToAppearance: Record<IStatusUpdate['state'], LozengeAppearance> = {
  'will-queue-when-ready': 'new',
  queued: 'new',
  running: 'inprogress',
  success: 'success',
  fail: 'removed',
  aborted: 'moved',
};

const landStatusToNiceString: Record<IStatusUpdate['state'], string> = {
  'will-queue-when-ready': 'Waiting to Land',
  queued: 'In Queue',
  running: 'Running',
  success: 'Succeeded',
  aborted: 'Aborted',
  fail: 'Failed',
};

const landStatusToPastTense: Record<IStatusUpdate['state'], string> = {
  'will-queue-when-ready': 'Told To Land When Ready',
  queued: 'Told To Land',
  running: 'Started',
  success: 'Succeeded',
  fail: 'Failed',
  aborted: 'Aborted',
};

const buildUrlFromId = (base: string, id: number) => `${base}/addon/pipelines/home#!/results/${id}`;

const prUrlFromId = (base: string, id: number) => `${base}/pull-requests/${id}`;

export type QueueItemProps = {
  request: ILandRequest;
  status: IStatusUpdate | null;
  bitbucketBaseUrl: string;
};

export function QueueItem(props: QueueItemProps) {
  const { bitbucketBaseUrl, request, status } = props;

  if (!status) return null;

  return (
    <a
      className={`${queueItemStyles} queue-item`}
      href={request.buildId ? buildUrlFromId(bitbucketBaseUrl, request.buildId) : '#'}
    >
      <div className="queue-item__title">
        <a href={prUrlFromId(bitbucketBaseUrl, request.pullRequestId)}>
          [PR #{request.pullRequestId}]
        </a>{' '}
        {request.pullRequest.title}
      </div>
      <div className="queue-item__status-line">
        <StatusItem title="Status:">
          <Lozenge appearance={status ? landStatusToAppearance[status.state] : 'new'}>
            {landStatusToNiceString[status.state]}
          </Lozenge>
        </StatusItem>

        <StatusItem title="Author:">
          <Lozenge>
            <User aaid={request.pullRequest.authorAaid}>
              {user => {
                return user.displayName;
              }}
            </User>
          </Lozenge>
        </StatusItem>

        <StatusItem title={`${landStatusToPastTense[status.state]}:`}>
          {distanceInWords(status.date, { addSuffix: true })}
        </StatusItem>

        {['success', 'fail', 'aborted'].indexOf(status.state) !== -1 ? (
          <StatusItem title="Duration:">
            <Lozenge appearance="new">
              {duration(+new Date(request.created), +new Date(status.date))}
            </Lozenge>
          </StatusItem>
        ) : null}
      </div>
    </a>
  );
}

export function QueueItemJoined(props: QueueItemProps) {
  return (
    <div className={`${queueItemJoinedStyles} queue-item-joined`}>
      <QueueItem {...props} />
    </div>
  );
}
