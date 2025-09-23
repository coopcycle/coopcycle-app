import { useState } from 'react';
import {
  Menu,
  MenuItem,
  MenuItemLabel,
} from '@/components/ui/menu';
import { Button, ButtonText } from '@/components/ui/button';

export default function TasksMenu() {
  const [selected, setSelected] = useState(new Set([]));
  return (
    <Menu
      placement="bottom left"
      selectionMode="single"
      selectedKeys={selected}
      offset={0}
      className="p-1.5"
      onSelectionChange={keys => {
        setSelected(keys);
      }}
      closeOnSelect={true}
      trigger={({ ...triggerProps }) => {
        return (
          <Button {...triggerProps}>
            <ButtonText>Menu</ButtonText>
          </Button>
        );
      }}>
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
