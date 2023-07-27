//
//  PXInstructionsAccreditationCommentComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsAccreditationCommentComponent: NSObject, PXComponentizable {
    var props: PXInstructionsAccreditationCommentProps

    init(props: PXInstructionsAccreditationCommentProps) {
        self.props = props
    }
    func render() -> UIView {
       return PXInstructionsAccreditationCommentRenderer().render(self)
    }
}
class PXInstructionsAccreditationCommentProps: NSObject {
    var accreditationComment: String?
    init(accreditationComment: String?) {
        self.accreditationComment = accreditationComment
    }
}
