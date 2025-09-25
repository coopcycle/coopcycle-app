// TasksMenu.tsx
import { useEffect, useState } from 'react';
import {
  Menu,
  MenuItem,
  MenuItemLabel,
} from '@/components/ui/menu';

type TasksMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TasksMenu({ isOpen, onClose }: TasksMenuProps) {
  const [selected, setSelected] = useState(new Set<string>());

  useEffect(() => {
    if (!isOpen) {
      setSelected(new Set());
    }
  }, [isOpen]);

  return (
    <Menu
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="bottom left"
      selectionMode="single"
      selectedKeys={selected}
      offset={0}
      className="p-1.5"
      onSelectionChange={(keys) => {
        setSelected(keys as Set<string>);
      }}
      closeOnSelect={true}
    >
      <MenuItem
        key="Complete Task"
        textValue="Complete Task"
        className="p-2 web:min-w-[294px] min-w-[225px]">
        <MenuItemLabel size="sm">Completar</MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Cancel Task"
        textValue="Cancel Task"
        className="p-2 web:min-w-[294px] min-w-[225px]">
        <MenuItemLabel size="sm">Cancelar</MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Report incidence"
        textValue="Report incidence"
        className="p-2">
        <MenuItemLabel size="sm">Reportar Incidencia</MenuItemLabel>
      </MenuItem>
      <MenuItem key="Edit" textValue="Edit" className="p-2">
        <MenuItemLabel size="sm">Editar</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}