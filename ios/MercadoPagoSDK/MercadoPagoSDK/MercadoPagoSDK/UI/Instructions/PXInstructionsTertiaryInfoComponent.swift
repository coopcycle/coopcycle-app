//
//  PXInstructionsTertiaryInfoComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsTertiaryInfoComponent: NSObject, PXComponentizable {
    var props: PXInstructionsTertiaryInfoProps

    init(props: PXInstructionsTertiaryInfoProps) {
        self.props = props
    }
    func render() -> UIView {
        return PXInstructionsTertiaryInfoRenderer().render(self)
    }
}
class PXInstructionsTertiaryInfoProps: NSObject {
    var tertiaryInfo: [String]?
    init(tertiaryInfo: [String]?) {
        self.tertiaryInfo = tertiaryInfo
    }
}
