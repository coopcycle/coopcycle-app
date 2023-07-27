//
//  PXInstructionsReferenceComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsReferenceComponent: NSObject, PXComponentizable {
    var props: PXInstructionsReferenceProps

    init(props: PXInstructionsReferenceProps) {
        self.props = props
    }
    func render() -> UIView {
        return PXInstructionsReferenceRenderer().render(self)
    }
}
class PXInstructionsReferenceProps: NSObject {
    var reference: PXInstructionReference?
    init(reference: PXInstructionReference?) {
        self.reference = reference
    }
}
