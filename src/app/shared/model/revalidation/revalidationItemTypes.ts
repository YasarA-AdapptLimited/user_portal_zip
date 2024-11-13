
import { RevalidationItemType } from './RevalidationItemType';
import { RevalidationItemTypeConfig } from './RevalidationItemTypeConfig';

export const revalidationItemTypes: RevalidationItemTypeConfig[] = [
  {
    type: RevalidationItemType.Planned,
    icon: 'calendar',
    title: 'Planned CPD',
    feedbackType: 'plannedCpdFeedback'
  },
  {
    type: RevalidationItemType.Unplanned,
    title: 'Unplanned CPD',
    icon: 'calendar-o',
    feedbackType: 'unplannedCpdFeedback'
  },
  {
    type: RevalidationItemType.PeerDiscussion,
    icon: 'comments',
    title: 'Peer discussion',
    feedbackType: 'peerDiscussionFeedback'
  },
  {
    type: RevalidationItemType.ReflectiveAccount,
    icon: 'address-book',
    title: 'Reflective account',
    feedbackType: 'reflectiveAccountFeedback'
  }
]
