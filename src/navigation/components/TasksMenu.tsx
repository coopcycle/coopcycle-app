// TasksMenu.tsx
import { ReactElement } from 'react';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';

interface SelectedTasksMenu {
  key: string;
  text: string;
  isDisabled?: boolean;
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
      trigger={renderTrigger}
      placement="bottom left"
      selectionMode="none"
      offset={0}
      className="p-1.5"
    >
      {options.map((opt) => {
        return( !opt.isDisabled &&
          <MenuItem 
            key={opt.key} 
            textValue={opt.text} 
            onPress={opt.action}
            className="p-2 web:min-w-[294px] min-w-[225px]"
            testID={`${opt.key}Button`}
          >
            <MenuItemLabel size="sm">{opt.text}</MenuItemLabel>
          </MenuItem> 
        )
      })}
    </Menu>
  );
}