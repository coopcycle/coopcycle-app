//
//  PXInstructionsInteractionComponent.swift
//  MercadoPagoSDK
//
//  Created by Marcelo Oscar José on 25/10/2018.
//

import Foundation

class PXInstructionsInteractionComponent: NSObject, PXComponentizable {
    var props: PXInstructionsInteractionProps

    init(props: PXInstructionsInteractionProps) {
        self.props = props
    }
    func render() -> UIView {
        return PXInstructionsInteractionRenderer().render(self)
    }
}

class PXInstructionsInteractionProps: NSObject {
    var interaction: PXInstructionInteraction?
    init(interaction: PXInstructionInteraction?) {
        self.interaction = interaction
    }
}
