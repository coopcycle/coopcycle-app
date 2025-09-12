import { Check } from 'lucide-react-native'
import { Fab, FabIcon } from '@/components/ui/fab';
import React, { Component } from 'react';

class ItemsBulkFabButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  addItem(item) {
    if (this.state.items.some(i => i.id === item.id)) {
      return;
    }

    this.setState({
      items: [...this.state.items, item],
    });
  }

  removeItem(item) {
    this.setState({
      items: this.state.items.filter(i => i.id !== item.id),
    });
  }

  updateItems(items) {
    this.setState({
      items: this.state.items.filter(item => items.some(i => i.id === item.id)),
    });
  }

  render() {
    return (
      <>
        {this.state.items.length <= 1 ? null : (
          <Fab
            size="xl"
            placement="bottom right"
            className="bg-success-300"
            onPress={() => this.props.onPressed(this.state.items)}
            testID="bulkAssignButton">
            <FabIcon as={Check} />
          </Fab>
        )}
      </>
    );
  }
}

export default ItemsBulkFabButton;
