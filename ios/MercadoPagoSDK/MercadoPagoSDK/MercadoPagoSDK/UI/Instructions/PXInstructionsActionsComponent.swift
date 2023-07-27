//
//  PXInstructionsActionsComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsActionsComponent: NSObject, PXComponentizable {
    var props: PXInstructionsActionsProps

    init(props: PXInstructionsActionsProps) {
        self.props = props
    }

    public func getActionComponents() -> [PXInstructionsActionComponent] {
        var actionComponents: [PXInstructionsActionComponent] = []
        if let actions = props.instructionActions, !actions.isEmpty {
            for action in actions where action.tag == PXActionTag.LINK.rawValue {
                let actionProps = PXInstructionsActionProps(instructionActionInfo: action)
                let actionComponent = PXInstructionsActionComponent(props: actionProps)
                actionComponents.append(actionComponent)
            }
        }
        return actionComponents
    }

    func render() -> UIView {
        return PXInstructionsActionsRenderer().render(self)
    }
}
class PXInstructionsActionsProps: NSObject {
    var instructionActions: [PXInstructionAction]?
    init(instructionActions: [PXInstructionAction]?) {
        self.instructionActions = instructionActions
    }
}
