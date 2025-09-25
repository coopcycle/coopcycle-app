// TasksMenu.tsx
import { ReactElement } from 'react';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';

interface SelectedTasksMenu {
  key: string;
  text: string;
  action: () => void;
}

type TasksMenuProps = {
  options: SelectedTasksMenu[];
  renderTrigger: (props: Record<string, unknown>) => ReactElement;
};

export default function TasksMenu({
  renderTrigger,
  options
}: TasksMenuProps) {
  return (
    <Menu
      trigger={(triggerProps) => (
        renderTrigger(triggerProps)
      )}
      placement="bottom left"
      selectionMode="single"
      offset={0}
      className="p-1.5"
    >
      {options.map((opt) => {
        return(
          <MenuItem key={opt.key} textValue={opt.text} className="p-2 web:min-w-[294px] min-w-[225px]" onPress={opt.action}>
            <MenuItemLabel size="sm">{opt.text}</MenuItemLabel>
          </MenuItem>
        )
      })}
    </Menu>
  );
}