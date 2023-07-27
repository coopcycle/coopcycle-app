//
//  PXInstructionsReferencesComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsReferencesComponent: NSObject, PXComponentizable {
    var props: PXInstructionsReferencesProps

    init(props: PXInstructionsReferencesProps) {
        self.props = props
    }

    public func getReferenceComponents() -> [PXInstructionsReferenceComponent] {
        var referenceComponents: [PXInstructionsReferenceComponent] = []
        if let references = props.references, !references.isEmpty {
            for reference in references {
                let referenceProps = PXInstructionsReferenceProps(reference: reference)
                let referenceComponent = PXInstructionsReferenceComponent(props: referenceProps)
                referenceComponents.append(referenceComponent)
            }
        }
        return referenceComponents
    }

    func render() -> UIView {
        return PXInstructionsReferencesRenderer().render(self)
    }
}
class PXInstructionsReferencesProps: NSObject {
    var title: String?
    var references: [PXInstructionReference]?
    init(title: String, references: [PXInstructionReference]?) {
        self.title = title
        self.references = references
    }
}
