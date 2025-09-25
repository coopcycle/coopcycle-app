// Source file for common logic related to how task is presented to a user (UI)

import {
  Check,
  TriangleAlert,
  X,
  ArrowDown,
  Box,
  Play,
  MessageCircle,
  Boxes,
} from 'lucide-react-native';

const assignOrderIconName = 'cubes';
const assignTaskIconName = 'cube';
const commentsIconName = 'comments';
const doingIconName = 'play-circle';
const doneIconName = 'check';
const failedIconName = 'remove';
const incidentIconName = 'exclamation-triangle';

const pickupIconName = 'cube';
const dropOffIconName = 'arrow-down';

const taskTypeIconName = task =>
  task.type === 'PICKUP' ? pickupIconName : dropOffIconName;

const DoneIcon = Check;
const IncidentIcon = TriangleAlert;
const FailedIcon = X;
const PickupIcon = Box;
const DropoffIcon = ArrowDown;
const DoingIcon = Play;
const CommentsIcon = MessageCircle;
const AssignTaskIcon = Box;
const AssignOrderIcon = Boxes;

const taskTypeIcon = task =>
  task.type === 'PICKUP' ? PickupIcon : DropoffIcon;

export {
  assignOrderIconName,
  assignTaskIconName,
  commentsIconName,
  doingIconName,
  doneIconName,
  dropOffIconName,
  failedIconName,
  incidentIconName,
  pickupIconName,
  taskTypeIconName,
  DoneIcon,
  IncidentIcon,
  FailedIcon,
  PickupIcon,
  DropoffIcon,
  taskTypeIcon,
  CommentsIcon,
  AssignTaskIcon,
  AssignOrderIcon,
};
