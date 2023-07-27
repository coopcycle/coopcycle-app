//
//  PXInstructionsInteractionsComponent.swift
//  MercadoPagoSDK
//
//  Created by Marcelo Oscar José on 24/10/2018.
//

import Foundation

class PXInstructionsInteractionsComponent: NSObject, PXComponentizable {
    var props: PXInstructionsInteractionsProps

    init(props: PXInstructionsInteractionsProps) {
        self.props = props
    }

    public func getInteractionComponents() -> [PXInstructionsInteractionComponent] {
        var interactionComponents: [PXInstructionsInteractionComponent] = []
        if let interactions = props.interactions, !interactions.isEmpty {
            for interaction in interactions {
                let interactionProps = PXInstructionsInteractionProps(interaction: interaction)
                let interactionComponent = PXInstructionsInteractionComponent(props: interactionProps)
                interactionComponents.append(interactionComponent)
            }
        }
        return interactionComponents
    }

    func render() -> UIView {
        return PXInstructionsInteractionsRenderer().render(self)
    }
}

class PXInstructionsInteractionsProps: NSObject {
    var title: String?
    var interactions: [PXInstructionInteraction]?
    init(title: String, interactions: [PXInstructionInteraction]?) {
        self.title = title
        self.interactions = interactions
    }
}
